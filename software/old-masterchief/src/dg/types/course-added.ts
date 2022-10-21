import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';
import { StateAbbreviations } from '../stateAbbreviations';

export type CourseAdded = JSONEventType<
  EventNames.CourseAdded,
  {
    id: string;
    name: string;
    state: StateAbbreviations;
    latitude: number;
    longitude: number;
  }
>;
