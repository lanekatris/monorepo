import { BaseJsonEvent } from './base-json-event';
import { UiMaintenanceCreated } from '../../schema/schema';
import { JSONType } from '@eventstore/db-client';
import { BaseEvent } from './base-event';

export interface MaintenanceCreatedData
  extends BaseEvent,
    Pick<UiMaintenanceCreated, 'name' | 'equipment'> {}

export type MaintenanceCreated = BaseJsonEvent<
  'maintenance-created',
  Omit<MaintenanceCreatedData, 'eventName'> & JSONType
>;
