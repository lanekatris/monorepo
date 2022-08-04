import { EventName } from '../../schema/schema';
import { JSONType } from '@eventstore/db-client';
import { MetadataType } from '@eventstore/db-client/dist/types/events';

export declare type BaseJsonEvent<
  Type extends EventName = EventName,
  Data extends JSONType = JSONType,
  Metadata extends MetadataType | unknown = unknown,
> = Metadata extends MetadataType
  ? {
      type: Type;
      data: Data;
      metadata: Metadata;
    }
  : {
      type: Type;
      data: Data;
      metadata?: Metadata;
    };
