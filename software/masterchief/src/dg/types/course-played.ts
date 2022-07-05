import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';

export enum CoursePlayedSource {
  Scorecard = 'scorecard',
  Manual = 'manual',
}

export type CoursePlayed = JSONEventType<
  EventNames.CoursePlayed,
  {
    id: string;
    courseId: string;
    source: CoursePlayedSource;
  }
>;
