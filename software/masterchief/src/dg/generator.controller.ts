import {
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Render,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { format } from 'date-fns';
import { createReadStream } from 'fs';
import { groupBy, intersection, uniq } from 'lodash';
import { State, StateAbbreviations } from './stateAbbreviations';
import { join } from 'path';
import { ESDB } from '../constants';
import { Express } from 'express';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
} from '@eventstore/db-client';
import { EventNames } from './types/disc-added';
import { FileInterceptor } from '@nestjs/platform-express';
import { DgService } from './dg.service';
import { CoursePlayed } from './types/course-played';
import { nanoid } from 'nanoid';
import { UdiscScorecardEntry } from './types/udisc-scorecard-entry';

const GeoJSON = require('geojson');
const csv = require('csvtojson');
const JSZip = require('jszip');

export const MINIO_CONNECTION = 'MINIO_CONNECTION';

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
export class GeneratorController {
  private readonly logger = new Logger(GeneratorController.name);

  constructor(
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
    @Inject(DgService)
    private service: DgService,
  ) {}

  @Get('generate')
  async generate(
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    this.logger.log(`Starting GeoJSON generation...`);
    const fileStream = createReadStream(join(__dirname, 'courses.csv'));
    const entries: CsvEntry[] = await csv().fromStream(fileStream);
    this.logger.log(`courses.csv has ${entries.length} entries`);

    // load into esdb
    // const dbResult = await this.client.appendToStream(
    //   'dg-testies-dataload',
    //   entries.map((entry) => {
    //     return jsonEvent<CourseAdded>({
    //       type: EventNames.CourseAdded,
    //       data: {
    //         id: entry.id,
    //         name: entry.name,
    //         latitude: entry.latitude,
    //         longitude: entry.longitude,
    //       },
    //     });
    //   }),
    // );
    // console.log('dbresult', dbResult);

    const folder = format(new Date(), 'y-LL-dd--hh-mm-ss');
    let i = 1;

    const zip = new JSZip();

    const stateEntries = groupBy(entries, (x) => x.state);
    const states = Object.keys(stateEntries);

    this.logger.log(`Creating files for ${states.length} states: ${states}`);
    states.forEach((state) => {
      const entries = stateEntries[state];
      const geoJsonObject = GeoJSON.parse(
        entries.map((x) => ({
          ...x,
          icon: 'emoji-📀',
          marker_type: 'outlined-icon',
          marker_color: '#F42410',
          marker_decoration: 'emoji-📀',
        })),
        {
          Point: ['latitude', 'longitude'],
        },
      );
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
  async uploadMyRounds(@UploadedFile() file: Express.Multer.File) {
    const contents = file.buffer.toString();
    const entries: UdiscScorecardEntry[] = await csv().fromString(contents);
    const groupedByRounds = groupBy(entries, (x) => x.Date);
    const rounds = Object.keys(groupedByRounds);
    const courseNames = entries.map((x) => x.CourseName);
    const uniqCourseNames = [...new Set(courseNames)];

    this.logger.log(`Total rounds: ${rounds.length}`);

    const allPdgaIds = await this.service.getAllCourseIds();
    this.logger.log(`All pdga ids length: ${allPdgaIds.length}`);

    // UDisc -> PDGA id mapping
    // const mappings = {
    //   'Parchment Valley Winter Lake':
    //     'parchment-valley-winter-lake-disc-golf-course',
    //   'Orange Crush': 'orange-crush',
    // };
    // const mappingValues = Object.values(mappings);

    // const playedCourseIds = await this.service.getPlayedCourses();

    const playerName = 'Lane';

    // Is course known?
    //    yes - create played event if doesn't already exist
    // dynamically generate ids?

    // const playedCourseNames: string[] = [];

    // const addMe = new Set();

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

      // const guessedIds = [
      //   // round.CourseName.toLowerCase().replace(/ /g, '-') + '-disc-golf-course',
      //   round.CourseName.toLowerCase().replace(/ /g, '-'),
      // ];

      // You can't do multiple since the data could match both :(
      const guessedId = round.CourseName.toLowerCase().replace(/ /g, '-');

      // const matchedValues = intersection(allPdgaIds, guessedIds);
      // if (matchedValues.length > 1)
      //   throw new Error(`This is impossible: ${matchedValues}`);

      // const courseId = matchedValues[0];

      if (allPdgaIds.includes(guessedId)) {
        stats.played.add(guessedId);
      } else {
        stats.unknown.add(round.CourseName);
      }

      // console.log('matched values', courseId);
      //   if (matchedValues.length && !playedCourseIds.includes(matchedValues[0])) {
      //     const event = jsonEvent<CoursePlayed>({
      //       type: EventNames.CoursePlayed,
      //       data: {
      //         id: nanoid(),
      //         courseId: matchedValues[0],
      //       },
      //     });
      //     // await this.esdb.appendToStream('my-courses', event);
      //     playedCourseIds.push(matchedValues[0]);
      //     stats.played.add(matchedValues[0]);
      //   } else {
      //     // addMe.add(`${round.CourseName}`);
      //     stats.unknown.add(round.CourseName);
      //   }
      //
      //   // let's find the id
      //   // const pdgaCourseId = mappings[round.CourseName];
      //   // if (!pdgaCourseId) {
      //   //   // const guessedPdgaCourseId =
      //   //
      //   //   const guessedIds = [
      //   //     round.CourseName.toLowerCase().replace(/ /g, '-') +
      //   //       '-disc-golf-course',
      //   //     round.CourseName.toLowerCase().replace(/ /g, '-'),
      //   //   ];
      //   //
      //   //   // if (Object.values(mappings).some(x => )) {
      //   //   const matchedValues = intersection(allPdgaIds, guessedIds);
      //   //   if (matchedValues.length) {
      //   //     this.logger.warn(
      //   //       `Generated this id: ${round.CourseName}:${matchedValues}, add it to your mappings`,
      //   //     );
      //   //     addMe.add(`${round.CourseName}:${matchedValues}`);
      //   //   } else {
      //   //     this.logger.error(
      //   //       `You need to find the pdga id for udisc course name: ${round.CourseName} guess: ${guessedIds}`,
      //   //     );
      //   //   }
      //   //
      //   //   continue;
      //   // }
      //
      //   // this.logger.log(`Create played course event for: ${round.CourseName}`);
      //   // if (!playedCourseNames.includes(pdgaCourseId)) {
      //   //   playedCourseNames.push(pdgaCourseId);
      //   // }
    }

    // this.logger.log(playedCourseNames);
    // this.logger.log(`courses played: ${playedCourseNames.length}`);
    // console.log('add me', addMe);

    // 108 courses played by udisc
    return {
      played: [...stats.played].sort(),
      unknown: [...stats.unknown].sort(),
      roundNames: [...stats.roundNames].sort(),
      playedLength: [...stats.played].length,
      unknownLength: [...stats.unknown].length,
      roundLength: [...stats.roundNames].length,
    };
  }
}
