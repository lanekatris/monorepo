import { BaseJsonEvent } from './base-json-event';
import { UiAdventureCreated } from '../schema';
import { JSONType } from '@eventstore/db-client';
import { BaseEvent } from './base-event';

export interface AdventureCreatedData
  extends BaseEvent,
    Pick<UiAdventureCreated, 'name' | 'activities'> {}

export type AdventureCreated = BaseJsonEvent<
  'adventure-created',
  AdventureCreatedData & JSONType,
  { source: 'CSV' | 'USER'; importId: string }
>;
