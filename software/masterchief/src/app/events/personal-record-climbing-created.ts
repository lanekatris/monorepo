import { BaseJsonEvent } from './base-json-event';
import { UiPersonalRecordClimbing } from '../schema';
import { BaseEvent } from './base-event';

export interface PersonalRecordClimbingData
  extends BaseEvent,
    Pick<UiPersonalRecordClimbing, 'name'> {}

export type PersonalRecordClimbingCreated = BaseJsonEvent<
  'personal-record-climbing-created',
  Omit<PersonalRecordClimbingData, 'eventName'>
>;
