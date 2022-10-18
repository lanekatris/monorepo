import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';

export type CourseMapped = JSONEventType<
  EventNames.CourseMapped,
  {
    id: string;
    sourceCourseName: string;
    destinationCourseId: string;
  }
>;
