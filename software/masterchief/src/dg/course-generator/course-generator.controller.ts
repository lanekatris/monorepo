import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { StateAbbreviations } from '../stateAbbreviations';
import { CoursesByStateService } from './courses-by-state.service';
import { MinioService } from 'nestjs-minio-client';
import axios from 'axios';
import { queue } from 'async';
import { Course } from './course';

export const MINIO_CONNECTION = 'MINIO_CONNECTION';
function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

@Controller('dg/course-generator')
export class CourseGeneratorController {
  private readonly log = new Logger(CourseGeneratorController.name);

  constructor(
    @Inject(CoursesByStateService) private service: CoursesByStateService,
    private readonly minioClient: MinioService,
  ) {}

  private async tryGetObject(bucket: string, objectName: string) {
    let take2;
    let htmlRecord;
    try {
      take2 = await this.minioClient.client.getObject(bucket, objectName);
      htmlRecord = await streamToString(take2);
    } catch (err) {
      // console.error(err);
    }
    return htmlRecord;
  }

  @Get()
  async kick() {
    // load data for one state then remove the state filter
    // const states = [StateAbbreviations.Ohio, StateAbbreviations.WestVirginia];
    const states = Object.values(StateAbbreviations);

    let stateI = 1;
    for (const state of states) {
      const result = await this.service.getCourses({ state });

      this.log.log(
        `Found ${result.length} courses for ${state} (${stateI}/${states.length})`,
      );

      // Let's load each individual's courses html
      let i = 1;
      for (const course of result) {
        const courseHtml = await this.tryGetObject(
          `dg-course-generator`,
          `course/${course.id}.html`,
        );
        if (!courseHtml) {
          this.log.log(
            `course html not found, getting: ${course.id} (${i}/${
              result.length
            } ${((i / result.length) * 100).toFixed(
              2,
            )}%) - states ${state}: (${stateI}/${states.length})`,
          );
          const idk = await axios.get(
            `https://www.pdga.com/${course.courseUrl}`,
          );
          await this.minioClient.client.putObject(
            `dg-course-generator`,
            `course/${course.id}.html`,
            idk.data,
          );
          // we now need to parse our data and get attributes from it
        } else {
          this.log.log(
            `course html already in db: ${course.id} (${i}/${result.length} ${(
              (i / result.length) *
              100
            ).toFixed(2)}%) - states ${state}: (${stateI}/${states.length})`,
          );
        }
        i++;
      }
      stateI++;
    }

    return 'kick';
  }
}
