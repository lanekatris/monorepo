import { BaseEvent } from './base-event';
import { UiNoteTaken } from '../schema';
import { BaseJsonEvent } from './base-json-event';
import { JSONType } from '@eventstore/db-client';

export interface NoteTakenData extends BaseEvent, Pick<UiNoteTaken, 'body'> {}
export type NoteTaken = BaseJsonEvent<'note-taken', NoteTakenData & JSONType>;
