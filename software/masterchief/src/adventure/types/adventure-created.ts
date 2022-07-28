import { JSONEventType, JSONType } from '@eventstore/db-client';
import { EventNames } from '../../dg/types/disc-added';

// export type AdventureCreatedData = JSONType & {
//   id: string;
//   date: string;
//   activities: AdventureActivity[];
//   name?: string;
// };

// export type AdventureCreated = JSONEventType<
//   EventNames.AdventureCreated,
//   AdventureCreatedData,
//   { source: 'CSV' | 'USER'; importId: string }
// >;

export type AdventureImportStarted = JSONEventType<
  EventNames.AdventureImportStarted,
  {
    id: string;
  }
>;
