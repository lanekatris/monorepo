import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';

export type DiscLost = JSONEventType<
  EventNames.DiscLost,
  {
    discId: string;
    date: Date;
  }
>;
