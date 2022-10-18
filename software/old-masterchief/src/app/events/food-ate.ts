import { BaseEvent } from './base-event';
import { UiFoodAte } from '../schema';
import { BaseJsonEvent } from './base-json-event';
import { JSONType } from '@eventstore/db-client';

export interface FoodAteData
  extends BaseEvent,
    Pick<UiFoodAte, 'name' | 'meal' | 'homemade'> {}

export type FoodAte = BaseJsonEvent<'food-ate', FoodAteData & JSONType>;
