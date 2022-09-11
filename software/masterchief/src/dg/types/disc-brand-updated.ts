import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';

export type DiscBrandUpdated = JSONEventType<
  EventNames.DiscBrandUpdated,
  {
    discId: string;
    date: Date;
    brand: string;
  }
>;
