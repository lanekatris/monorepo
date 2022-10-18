import { StateAbbreviations } from '../../stateAbbreviations';

export function getCourseListUrl(
  state: StateAbbreviations,
  page: number,
): string {
  const pageQuery = page === 0 ? '' : `&page=${page}`;
  return `https://www.pdga.com/course-directory/advanced?title=&field_course_location_country=US&field_course_location_locality=&field_course_location_administrative_area=${state}&field_course_location_postal_code=&field_course_type_value=All&rating_value=All&field_course_holes_value=All&field_course_total_length_value=All&field_course_target_type_value=All&field_course_tee_type_value=All&field_location_type_value=All&field_course_camping_value=All&field_course_facilities_value=All&field_course_fees_value=All&field_course_handicap_value=All&field_course_private_value=All&field_course_signage_value=All&field_cart_friendly_value=All${pageQuery}`;
}
