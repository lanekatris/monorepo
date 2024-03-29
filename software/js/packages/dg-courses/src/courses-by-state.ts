import _ from 'lodash';
import { Repository } from 'typeorm';
import { Course } from './entity/course';
import { Html } from './entity/html';
import { STATE } from './state';
import {
  extractCoursesFromHtml,
  ExtractCoursesResponse,
} from './html-to-courses';
import { getHtml } from './get-html';

interface CoursesByStateInput {
  state: STATE;
  htmlRepo: Repository<Html>;
}

function getUrl(state: STATE, page: number): string {
  const pageQuery = page === 0 ? '' : `&page=${page}`;
  return `https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=${state}&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All${pageQuery}`;
}

export class CoursesByState {
  private page = 0;

  private readonly input: CoursesByStateInput;

  constructor(input: CoursesByStateInput) {
    this.input = input;
  }

  private async downloadAndParseCourses(): Promise<ExtractCoursesResponse> {
    const { state, htmlRepo } = this.input;
    const url = getUrl(state, this.page);
    const htmlRecord = await htmlRepo.findOne({
      where: { state, page: this.page },
    });

    let response;
    if (htmlRecord) {
      console.log(
        `Pulling course list from cache for ${state}, page ${this.page} (Cache id ${htmlRecord.id})`
      );
      response = htmlRecord.html;
    } else {
      // Make get request
      console.log(`Scraping pdga.com for ${state}, page ${this.page}`);
      const html = await getHtml(url);
      await htmlRepo.save({
        state,
        page: this.page,
        url,
        html,
      });
      response = html;
    }

    this.page += 1;
    return extractCoursesFromHtml(response);
  }

  public async getCourses(): Promise<Course[]> {
    let courses: Course[] = [];

    let loadMore = true;
    while (loadMore) {
      // eslint-disable-next-line no-await-in-loop
      const response = await this.downloadAndParseCourses();
      console.log(response.pageStatus);

      courses = courses.concat(response.courses);
      loadMore = response.hasMore;
    }

    // Sometimes courses are duplicated
    const oldLength = courses.length;
    courses = _.uniqBy(courses, 'id');
    if (oldLength !== courses.length) {
      console.log(`Uniq killed: ${oldLength - courses.length} courses`);
    }

    return courses;
  }
}
