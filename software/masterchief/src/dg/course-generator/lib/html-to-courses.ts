import cheerio from 'cheerio';
import { CourseHeader } from '../dto/courseHeader';

export interface ExtractCoursesResponse {
  courses: CourseHeader[];
  hasMore: boolean;
}

function clean(input: string, type = 'string'): string | number {
  const result = input.replace(/\n/, '');

  if (type === 'num') return parseInt(result, 10);

  return result;
}

const replacements = new Map().set('!8603', '18603');

export function extractCoursesFromHtml(html: string): ExtractCoursesResponse {
  const $ = cheerio.load(html);
  const rows = $('tbody tr');

  const courses: CourseHeader[] = [];

  rows.each((index: number, element: any) => {
    const el = $(element);
    const courseUrl = el.find('.views-field-title a').attr('href');
    const id = courseUrl
      .replace('/course-directory/course/', '')
      .replace(/\//g, '')
      .replace(/%20/g, '');

    const zip = (
      clean(el.find('.views-field-field-course-location-1').text()) as string
    ).replace(/\s/g, '');

    const zipReplacement = replacements.get(zip);

    courses.push(
      new CourseHeader(
        id,
        courseUrl,
        el.find('.views-field-title a').text(),
        el.find('.views-field-field-course-location').text().replace(/\n/, ''),
        el.find('.addressfield-state').text(),
        zipReplacement || zip,
        clean(
          el.find('.views-field-field-course-holes').text(),
          'num',
        ) as number,
        clean(
          el
            .find('.average-rating')
            .text()
            .replace(/Average: /, ''),
          'num',
        ) as number,
      ),
    );
  });

  return {
    courses,
    hasMore: $('.pager-last.last').length > 0,
  };
}
