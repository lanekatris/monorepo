import { JSONEventType, JSONType } from '@eventstore/db-client';
import { EventNames } from '../../dg/types/disc-added';

export type AdventureImportStarted = JSONEventType<
  EventNames.AdventureImportStarted,
  {
    id: string;
  }
>;
