import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from '../../dg/types/disc-added';

export type AdventureDeleted = JSONEventType<
  EventNames.AdventureDeleted,
  {
    id: string;
  }
>;
