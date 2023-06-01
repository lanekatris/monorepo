import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';

export type DiscUpdated = JSONEventType<
  EventNames.DiscUpdated,
  {
    discId: string;
    model?: string;
    brand?: string;
  }
>;
