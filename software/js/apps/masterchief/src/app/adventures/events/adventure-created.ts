import { JSONEventType } from '@eventstore/db-client';
import { AdventureActivity } from '../models/adventure';

export type AdventureCreated = JSONEventType<
  'AdventureCreated',
  {
    date: Date;
    activities: AdventureActivity[];
  }
>;
