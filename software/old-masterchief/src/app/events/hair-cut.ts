import { BaseEvent } from './base-event';
import { UiHairCut } from '../schema';
import { BaseJsonEvent } from './base-json-event';
import { JSONType } from '@eventstore/db-client';

export interface HairCutData extends BaseEvent, Pick<UiHairCut, 'name'> {}

export type HairCut = BaseJsonEvent<'hair-cut', HairCutData & JSONType>;
