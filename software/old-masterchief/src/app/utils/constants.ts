export const ESDB = 'esdb';

export const BUCKET_DG_COURSE_GENERATOR = 'dg-course-generator';
export const STREAM_DG_DATA_LOAD = 'dg-data-load';

export const STREAM_COURSE_GENERATOR = 'dg-course-generator';

export const AWS_REGION = 'us-east-1';

export enum Search {
  IndexDiscGolfCourseAutocomplete = 'disc_golf_course_autocomplete',
  ErrorIndexAlreadyExists = 'resource_already_exists_exception',
  IndexNotes = 'notes',
}

export enum Esdb {
  StreamEvents = 'general-events',
  StreamBlog = 'blog-test',
}

export enum McStorage {
  NotesBucket = 'notes',
}
