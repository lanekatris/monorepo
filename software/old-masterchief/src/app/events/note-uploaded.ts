import { BaseEvent } from './base-event';
import { BaseJsonEvent } from './base-json-event';
import { JSONType } from '@eventstore/db-client';

export interface NoteUploadedData extends BaseEvent {
  filePath: string;
}

export type NoteUploaded = BaseJsonEvent<
  'note-uploaded',
  NoteUploadedData & JSONType
>;
