import { BaseEvent } from './base-event';
import { UiMovieWatched } from '../schema';
import { BaseJsonEvent } from './base-json-event';
import { JSONType } from '@eventstore/db-client';

export interface MovieWatchedData
  extends BaseEvent,
    Pick<UiMovieWatched, 'name'> {}

export type MovieWatched = BaseJsonEvent<
  'movie-watched',
  MovieWatchedData & JSONType
>;
