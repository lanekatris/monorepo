import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Redirect,
  Response,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { format } from 'date-fns';
import { createReadStream } from 'fs';
import { groupBy } from 'lodash';
import { StateAbbreviations } from './stateAbbreviations';
import { join } from 'path';
import { STREAM_DG_DATA_LOAD, ESDB } from '../app/constants';
import { Express } from 'express';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { EventNames } from './types/disc-added';
import { FileInterceptor } from '@nestjs/platform-express';
import { DgService } from './dg.service';
import { CoursePlayedSource } from './types/course-played';
import { UdiscScorecardEntry } from './types/udisc-scorecard-entry';
import { CourseAdded } from './types/course-added';
import { GuardMe } from '../auth/guard-me.guard';

const GeoJSON = require('geojson');
const csv = require('csvtojson');
const JSZip = require('jszip');

interface CsvEntry {
  id: string;
  name: string;
  city: string;
  state: StateAbbreviations;
  zip: string;
  holeCount: string;
  rating: string;
  latitude: number;
  longitude: number;
}

@Controller('dg/generator')
@UseGuards(GuardMe)
export class GeneratorController {
  private readonly logger = new Logger(GeneratorController.name);

  private readonly mappings = {
    AOTG: 'ravens-ridge',
    'Angry Beaver at Elon Park': 'elon-park-angry-beaver',
    'Arapahoe Basin DGC': 'arapahoe-basin-disc-golf-course',
    Bailey: 'bailey-disc-golf-course',
    'Beaver Ranch Disc Golf Course': 'beaver-ranch-conifer',
    'Beech Fork Championship 18': 'beech-fork-state-park-disc-golf-course',
    'Beech Fork Family 9': 'beech-fork-state-park-disc-golf-course',
    "Bird's Nest Disc Park": 'birds-nest-disc-park',
    'Bluebird Putting Course': 'beaver-ranch-bluebird-putting-course',
    'Buckhorn at Harris Lake County Park': 'buckhorn-harris-lake-county-park',
    'Burr Oak': 'burr-oak-state-park',
    'Casey R. Logan (OBX) DGC': 'casey-r-logan-disc-golf-course',
    'Cedar Lakes Disc Golf': 'cedar-lakes-disc-golf-course',
    'Colorado Mountain College - Glenwood':
      'colorado-mountain-college-spring-valley',
    'Dunbar City Park': 'dunbar-city-park-disc-golf-course',
    'Eagles Nest  @ Alley Park': 'eagles-nest-dgc-0',
    'Eastway Park': 'eastway-park-0', // this isn't in my csv
    'Eleanor Park DGC': 'eleanor-park',
    'Emory and Henry': 'emory-and-henry-college',
    'Fayette County Park/4H DGC': 'fayette-county-park',
    'Flat Rocks': 'flat-rocks-disc-golf-course',
    'Goose Landing': 'goose-landing-richfield-park',
    'Greenbrier State Forest': 'greenbrier-state-forest-disc-golf-course',
    'Gunnison’s Edge Disc Golf Course': 'confluence-disc-golf-course',
    'Jason Wintz Memorial DGC': 'jason-wintz-memorial-disc-golf-course',
    'Moccasin Creek': 'moccasin-creek-disc-golf-course',
    Mountaineer: 'mountaineer-disc-golf-course',
    'Mountaineer Disc Golf Course': 'mountaineer-disc-golf-course-0',
    'Nevin Park': 'nevin-park-disc-golf-course',
    'New London Tech DGC': 'new-london-tech',
    'Ohio State University DGC': 'ohio-state-university',
    'Ohio Valley University Disc Golf Course': 'ohio-valley-university',
    Olathe: 'town-olathe-disc-golf-course',
    'Paint Creek': 'paint-creek-state-park-disc-golf-course',
    'Parchment Valley Winter Lake':
      'parchment-valley-winter-lake-disc-golf-course',
    'Patriot DGC': 'patriot-disc-golf-course-triad-park',
    'Peak One': 'frisco-peninsula-rec-area',
    'Pipestem State Park': 'pipestem-state-park-disc-golf-course',
    'Plantation Ruins at Winget': 'plantation-ruins-winget',
    'Project Bad Apple DGC': 'project-bad-apple-dgc',
    'Redeemer - Blue': 'redeemer-park-disc-golf-course',
    'Redeemer - White': 'redeemer-white-course',
    'Redeemer - Yellow': 'redeemer-park-disc-golf-course',
    'Renaissance Park - Gold': 'renaissance-park',
    'Renaissance Park DGC - RenSke': 'renaissance-park-renske',
    'Riverbottom disc golf park': 'baldridge-park',
    'Rocky Mountain Village': 'easter-seals-disc-golf-course',
    'Rolling Pines': 'rolling-pines-disc-golf-course',
    'Rotary Park (Red)': 'rotary-park',
    'Rotary Park (Yellow)Indian Rock': 'indian-rock-rotary-park',
    'Sandusky Park': 'blackwater-creek',
    'Scioto Grove DGC': 'scioto-grove',
    'Seth Burton Memorial': 'seth-burton-memorial-disc-golf-course',
    'Socastee Park': 'socastee-recreation-park',
    'Sugar Hollow': 'sugar-hollow-dgc',
    'Sugaw Creek Park DGC': 'sugaw-creek-park',
    'THE Diavolo DGC @ New Hope Park': 'diavolo-new-hope-park',
    'The Big Buckeye': 'big-buckeye-broughton',
    'The Crossing Disc Golf Course': 'crossing',
    'The Mountwood Monster': 'mountwood-monster',
    'The SasQuatch': 'sasquatch-broughton-nature-and-wildlife-education-area',
    'The Scrapyard DGC': 'scrapyard-idlewild-park',
    'Valley Park': 'valley-park-dgc-0',
    'Wine Cellar': 'wine-cellar-disc-golf-course',
    'Woodchuck Ridge': 'woodchuck-ridge-disc-golf-course',
  };

  private readonly udiscCoursesNotInPdga = [
    'Connection Point',
    'GRACE PLACE DISC GOLF COURSE',
    'Gianinetti Park DGC',
    'Karmageddon',
  ];

  constructor(
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
    @Inject(DgService)
    private service: DgService,
  ) {}

  // todo: psot body - make me class with validation
  @Post(EventNames.CoursePlayed)
  @Redirect('/dg')
  async addManualCoursePlayed(@Body() body: { courseId: string }) {
    console.log('body', body);
    await this.service.coursePlayed(body.courseId, CoursePlayedSource.Manual);
  }

  @Post(EventNames.CourseExcluded)
  @Redirect('/dg')
  async courseExcluded(@Body() body: { courseId: string; reason?: string }) {
    console.log('body', body);
    const { courseId, reason } = body;
    await this.service.courseExcluded(courseId, reason);
  }

  @Get('generate')
  async generate(
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    this.logger.log(`Starting GeoJSON generation...`);
    const fileStream = createReadStream(join(__dirname, 'courses.csv'));
    const entries: CsvEntry[] = await csv().fromStream(fileStream);
    this.logger.log(`courses.csv has ${entries.length} entries`);

    // load into esdb
    const dbResult = await this.esdb.appendToStream(
      STREAM_DG_DATA_LOAD,
      entries.map((entry) => {
        return jsonEvent<CourseAdded>({
          type: EventNames.CourseAdded,
          data: {
            id: entry.id,
            name: entry.name,
            state: entry.state,
            latitude: entry.latitude,
            longitude: entry.longitude,
          },
        });
      }),
    );
    console.log('dbresult', dbResult);

    const allCourses = await this.service.getAllCourses();

    const folder = format(new Date(), 'y-LL-dd--hh-mm-ss');
    let i = 1;

    const zip = new JSZip();

    const stateEntries = groupBy(allCourses, (x) => x.state);
    const states = Object.keys(stateEntries);

    this.logger.log(`Creating files for ${states.length} states: ${states}`);
    states.forEach((state) => {
      const entries = stateEntries[state];
      const geoJsonObject = this.service.getGeoJson(entries);
      zip.file(`${state}-${folder}.json`, JSON.stringify(geoJsonObject));
      this.logger.log(`Added ${state} file to zip ${i}/${states.length}`);
      i++;
    });

    const zipData = await zip.generateAsync({ type: 'uint8array' });

    this.logger.log(`Done generating GeoJSON`);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="dg-courses-${folder}.zip"`,
    });
    return new StreamableFile(zipData);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  @Redirect('/dg')
  async uploadMyRounds(@UploadedFile() file: Express.Multer.File) {
    const contents = file.buffer.toString();
    const entries: UdiscScorecardEntry[] = await csv().fromString(contents);
    const groupedByRounds = groupBy(entries, (x) => x.Date);
    const rounds = Object.keys(groupedByRounds);

    this.logger.log(`Total rounds: ${rounds.length}`);

    const allPdgaCourses = await this.service.getAllCourses();
    const allPdgaIds = allPdgaCourses.map((x) => x.id);
    this.logger.log(`All pdga ids length: ${allPdgaCourses.length}`);
    const playerName = 'Lane';

    const stats = {
      played: new Set(),
      unknown: new Set(),
      roundNames: new Set(),
    };
    entries.forEach((x) => {
      stats.roundNames.add(x.CourseName);
    });

    for (const key of rounds) {
      const round = groupedByRounds[key].find(
        (x) => x.PlayerName === playerName,
      );
      if (!round) {
        this.logger.warn(`Round not found ${key} and ${playerName}`);
        continue;
      }

      // You can't do multiple since the data could match both :(
      const guessedId = round.CourseName.toLowerCase().replace(/ /g, '-');
      const mappedValue = this.mappings[round.CourseName];

      // mapping check first because of the buildout or guessing could get you into trouble
      if (mappedValue) {
        stats.played.add(mappedValue);
        await this.service.coursePlayed(
          mappedValue,
          CoursePlayedSource.Scorecard,
        );
        // check pdga ids
      } else if (allPdgaIds.includes(guessedId)) {
        stats.played.add(guessedId);
        await this.service.coursePlayed(
          guessedId,
          CoursePlayedSource.Scorecard,
        );
      } else if (this.udiscCoursesNotInPdga.includes(round.CourseName)) {
        stats.played.add(round.CourseName);
        await this.service.coursePlayed(
          round.CourseName,
          CoursePlayedSource.Scorecard,
        );
      } else {
        stats.unknown.add(round.CourseName);
      }
    }
  }
}
