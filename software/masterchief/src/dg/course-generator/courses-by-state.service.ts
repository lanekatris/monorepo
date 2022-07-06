import { uniqBy } from 'lodash';
import {
  extractCoursesFromHtml,
  ExtractCoursesResponse,
} from './html-to-courses';
import { getHtml } from './get-html';
import { Course } from './course';
import { StateAbbreviations } from '../stateAbbreviations';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CONNECTION } from './course-generator.controller';
import { MinioService } from 'nestjs-minio-client';

interface CoursesByStateInput {
  state: StateAbbreviations;
}

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

function getUrl(state: StateAbbreviations, page: number): string {
  const pageQuery = page === 0 ? '' : `&page=${page}`;
  return `https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=${state}&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All${pageQuery}`;
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
    const url = getUrl(state, this.page);
    // const htmlRecord = await htmlRepo.findOne({ state, page: this.page });
    const objectName = `grid/${state}-page-${this.page}.html`;
    let take2;
    let htmlRecord;
    try {
      take2 = await this.minioClient.client.getObject(
        `dg-course-generator`,
        objectName,
      );
      htmlRecord = await streamToString(take2);
    } catch (err) {
      // console.error(err);
    }

    let response;
    if (htmlRecord) {
      console.log(`Pulling from DB: ${objectName}`);
      response = htmlRecord;
    } else {
      // Make get request
      console.log(`Pulling from: ${url}`);
      const html = await getHtml(url);
      await this.minioClient.client.putObject(
        `dg-course-generator`,
        objectName,
        html,
      );
      // await htmlRepo.save({
      //   state,
      //   page: this.page,
      //   url,
      //   html,
      // });
      response = html;
    }

    this.page += 1;
    return extractCoursesFromHtml(response);
  }

  public async getCourses(input: CoursesByStateInput): Promise<Course[]> {
    this.input = input;
    this.page = 0;
    let courses: Course[] = [];

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

    return courses;
  }

  async onModuleInit(): Promise<void> {
    const bucketExists = await this.minioClient.client.bucketExists(
      `dg-course-generator`,
    );
    if (!bucketExists) {
      await this.minioClient.client.makeBucket(
        `dg-course-generator`,
        'us-east-1',
      );
    }
  }
}
