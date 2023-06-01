import { uniqBy } from 'lodash';
import {
  extractCoursesFromHtml,
  ExtractCoursesResponse,
} from './lib/html-to-courses';
import { getHtml } from './lib/get-html';
import { CourseHeader } from './dto/courseHeader';
import { StateAbbreviations } from '../stateAbbreviations';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import {
  AWS_REGION,
  BUCKET_DG_COURSE_GENERATOR,
  McStorage,
  STREAM_DG_DATA_LOAD,
} from '../../app/utils/constants';
import { streamToString } from '../../app/utils/stream-to-string';
import { getCourseListUrl } from './lib/get-course-list-url';

export interface CoursesByStateInput {
  state: StateAbbreviations;
}

export interface GetCoursesResult {
  courseHeaders: CourseHeader[];
  courseCount: number;
  coursesToLoad?: CourseHeader[];
}

@Injectable()
export class CoursesByStateService implements OnModuleInit {
  private page = 0;
  private input: CoursesByStateInput;

  constructor(
    // @Inject(MINIO_CONNECTION)
    private readonly minioClient: MinioService,
  ) {}

  private async downloadAndParseCourses(): Promise<ExtractCoursesResponse> {
    const { state } = this.input;
    const url = getCourseListUrl(state, this.page);
    // const htmlRecord = await htmlRepo.findOne({ state, page: this.page });
    const objectName = `grid/${state}-page-${this.page}.html`;
    let take2;
    let htmlRecord;
    try {
      take2 = await this.minioClient.client.getObject(
        BUCKET_DG_COURSE_GENERATOR,
        objectName,
      );
      htmlRecord = await streamToString(take2);
    } catch (err) {
      // console.error(err);
    }

    let response;
    if (htmlRecord) {
      // console.log(`Pulling from DB: ${objectName}`);
      response = htmlRecord;
    } else {
      // Make get request
      // console.log(`Pulling from: ${url}`);
      const html = await getHtml(url);
      await this.minioClient.client.putObject(
        BUCKET_DG_COURSE_GENERATOR,
        objectName,
        html,
      );
      response = html;
    }

    this.page += 1;
    return extractCoursesFromHtml(response);
  }

  public async getCourseHeaders(
    input: CoursesByStateInput,
  ): Promise<GetCoursesResult> {
    this.input = input;
    this.page = 0;
    let courses: CourseHeader[] = [];

    let loadMore = true;
    while (loadMore) {
      // eslint-disable-next-line no-await-in-loop
      const response = await this.downloadAndParseCourses();
      courses = courses.concat(response.courses);
      loadMore = response.hasMore;
    }

    // Sometimes courses are duplicated
    const oldLength = courses.length;
    courses = uniqBy(courses, 'id');
    if (oldLength !== courses.length) {
      console.log(`Uniq killed: ${oldLength - courses.length} courses`);
    }

    return {
      courseHeaders: courses,
      courseCount: courses.length,
    };
  }

  async onModuleInit(): Promise<void> {
    const buckets = [
      STREAM_DG_DATA_LOAD,
      BUCKET_DG_COURSE_GENERATOR,
      McStorage.NotesBucket,
    ];

    for (const bucketName of buckets) {
      const bucketExists = await this.minioClient.client.bucketExists(
        bucketName,
      );
      if (!bucketExists) {
        await this.minioClient.client.makeBucket(bucketName, AWS_REGION);
      }
    }
  }
}
