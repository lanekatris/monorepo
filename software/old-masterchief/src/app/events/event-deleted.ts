import { BaseJsonEvent } from './base-json-event';
import { UiEventDeleted } from '../schema';
import { BaseEvent } from './base-event';
import { JSONType } from '@eventstore/db-client';

export interface EventDeletedData
  extends BaseEvent,
    Pick<UiEventDeleted, 'eventId'> {}

export type EventDeleted = BaseJsonEvent<
  'event-deleted',
  EventDeletedData & JSONType
>;
