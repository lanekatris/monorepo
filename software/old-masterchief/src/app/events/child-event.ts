import { BaseEvent } from './base-event';
import { UiChildEvent } from '../schema';
import { BaseJsonEvent } from './base-json-event';
import { JSONType } from '@eventstore/db-client';

export interface ChildEventData extends BaseEvent, Pick<UiChildEvent, 'name'> {}

export type ChildEventCreated = BaseJsonEvent<
  'child-event-created',
  ChildEventData & JSONType
>;
