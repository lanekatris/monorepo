import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from './disc-added';
import { DiscStatus } from '../dg.service';

export type DiscStatusUpdated = JSONEventType<
  EventNames.DiscStatusUpdated,
  {
    discId: string;
    date: Date;
    status: DiscStatus;
  }
>;
