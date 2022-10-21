import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';

export type CourseExcluded = JSONEventType<
  EventNames.CourseExcluded,
  {
    id: string;
    courseId: string;
    reason?: string;
  }
>;
