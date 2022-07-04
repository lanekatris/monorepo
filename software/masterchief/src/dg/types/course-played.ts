import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';

export type CoursePlayed = JSONEventType<
  EventNames.CoursePlayed,
  {
    id: string;
    courseId: string;
  }
>;
