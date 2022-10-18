import { BaseEvent } from './base-event';
import { UiNoteTaken } from '../schema';
import { BaseJsonEvent } from './base-json-event';
import { JSONType } from '@eventstore/db-client';

export interface HealthObservationData
  extends BaseEvent,
    Pick<UiNoteTaken, 'body' | 'tags'> {}
export type HealthObservation = BaseJsonEvent<
  'health-observation',
  HealthObservationData & JSONType
>;
