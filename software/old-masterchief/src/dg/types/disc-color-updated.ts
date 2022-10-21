import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';

export type DiscColorUpdated = JSONEventType<
  EventNames.DiscColorUpdated,
  {
    discId: string;
    date: Date;
    color: string;
  }
>;
