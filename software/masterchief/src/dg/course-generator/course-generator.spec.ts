import {
  TEST_COURSE_HTML_NO_PARKING_LOT,
  TEST_COURSE_HTML_WITH_PARKING_LOT,
} from './test-data';
import cheerio from 'cheerio';

interface Coordinate {
  latitude: number;
  longitude: number;
}

interface ParseCourseHtmlResponse {
  parkingLot?: Coordinate;
  firstTee?: Coordinate;
}

function getCoordinateFromUrl(url: string): Coordinate | null {
  if (!url) return;
  const searchParams = new URLSearchParams(url);
  const queryString = searchParams.get('q');
  if (!queryString) return;

  const [latitude, longitude] = queryString.split(',');
  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
  };
}

function parseCourseHtml(html: string): ParseCourseHtmlResponse {
  const $ = cheerio.load(html);
  const parkingLot = getCoordinateFromUrl(
    $('.views-field-field-course-parking-lot-coord-revision-id a').attr('href'),
  );

  const firstTee = getCoordinateFromUrl(
    $('.views-field-field-course-first-tee-coord-revision-id a').attr('href'),
  );

  return {
    parkingLot,
    firstTee,
  };
}

describe('CourseGenerator', () => {
  it('could not find parking lot coordinates', () => {
    expect(parseCourseHtml(TEST_COURSE_HTML_NO_PARKING_LOT)).toEqual({
      firstTee: undefined,
      parkingLot: undefined,
    } as ParseCourseHtmlResponse);
  });
  it('parses parking lot coordinates', () => {
    expect(parseCourseHtml(TEST_COURSE_HTML_WITH_PARKING_LOT)).toEqual({
      parkingLot: {
        longitude: -81.344278573988,
        latitude: 38.771525830251,
      },
      firstTee: {
        latitude: 38.771497337887,
        longitude: -81.34476137161,
      },
    } as ParseCourseHtmlResponse);
  });
});
