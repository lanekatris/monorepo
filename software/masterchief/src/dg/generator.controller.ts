import {
  Controller,
  Get,
  Inject,
  Logger,
  Render,
  Response,
  StreamableFile,
} from '@nestjs/common';
import { Client } from 'minio';
import { format } from 'date-fns';
import { createReadStream } from 'fs';
import { groupBy } from 'lodash';
import { State, StateAbbreviations } from './stateAbbreviations';
import { join } from 'path';

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

  @Get()
  @Render('dg/editor')
  async index() {
    return {};
  }

  @Get('generate')
  async generate(
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const fileStream = createReadStream(join(__dirname, 'courses.csv'));
    const entries = await csv().fromStream(fileStream);
    this.logger.log(`courses.csv has ${entries.length} entries`);

    const folder = format(new Date(), 'y-LL-dd--hh-mm-ss');
    let i = 1;

    const zip = new JSZip();

    const states = [
      State.WestVirginia,
      State.Ohio,
      State.Pennsylvania,
      State.Maryland,
      State.Virginia,
      State.NorthCarolina,
      State.Kentucky,
      State.Tennessee,
    ];
    const stateEntries = groupBy(entries, (x) => x.state);

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

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="dg-courses-${folder}.zip"`,
    });
    return new StreamableFile(zipData);
  }
}
