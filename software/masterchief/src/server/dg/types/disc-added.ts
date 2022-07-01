import { JSONEventType } from '@eventstore/db-client';

export type DiscAdded = JSONEventType<
  'disc-added',
  {
    id: string;
    date: Date;
    brand: string;
    model: string;
  }
>;
