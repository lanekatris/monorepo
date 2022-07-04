import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';

export type CourseAdded = JSONEventType<
  EventNames.CourseAdded,
  {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  }
>;
