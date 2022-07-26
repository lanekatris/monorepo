import {
  Body,
  Controller,
  Inject,
  Post,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { GuardMe } from '../auth/guard-me.guard';
import { EventNames } from '../dg/types/disc-added';
import { IsNotEmpty } from 'class-validator';
import {
  EventStoreDBClient,
  jsonEvent,
  JSONEventType,
  JSONType,
} from '@eventstore/db-client';
import { nanoid } from 'nanoid';
import { Esdb, ESDB } from '../app/constants';
import { format } from 'date-fns';
import { AdventureCreated } from '../adventure/types/adventure-created';
import { CreateAdventureDto } from '../adventure/adventure.controller';
import { EventNames1, MaintenanceCreatedData } from '../schema/schema';
import { MetadataType } from '@eventstore/db-client/dist/types/events';

// export class CreateMaintenanceDto {
//   @IsNotEmpty()
//   name: string;
//   date: string;
// }

// export type MaintenanceCreated = JSONEventType<
//   EventNames.MaintenanceCreated,
//   {
//     id: string;
//     name: string;
//     date: string;
//   }
// >;

// type Idk = MaintenanceCreatedData extends JSONType;
// type Idk = MaintenanceCreatedData & JSONType;

// export type MaintenanceCreated = JSONEventType<
//   'maintenance-created',
//   MaintenanceCreatedData & JSONType
// >;
//
// export type BaseJsonEvent = JSONEventType<EventNames1, Idk extends JSONType> = {
//   type: Idk
// }

export declare type JSONEventTypeIdk<
  Type extends EventNames1 = EventNames1,
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

export type MaintenanceCreated = JSONEventTypeIdk<
  'maintenance-created',
  Omit<MaintenanceCreatedData, 'eventName'> & JSONType
>;

// todo: inherit from class
export class CreatePersonalRecordClimbingDto {
  @IsNotEmpty()
  name: string;

  date: string;
}

// todo: inherit from class
export type PersonalRecordClimbingCreated = JSONEventType<
  EventNames.PersonalRecordClimbingCreated,
  {
    id: string;
    name: string;
    date: string;
  }
>;

function formatRedirectUrl(event: EventNames) {
  return `/events?eventName=${event}`;
}

@Controller('general-events')
@UseGuards(GuardMe)
export class GeneralEventsController {
  constructor(
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}

  @Post(EventNames.MaintenanceCreated)
  @Redirect(formatRedirectUrl(EventNames.MaintenanceCreated))
  public async createMaintenance(@Body() body: MaintenanceCreatedData) {
    const { name, date } = body;
    const event = jsonEvent<MaintenanceCreated>({
      type: 'maintenance-created',
      data: {
        id: nanoid(),
        name,
        date: date || format(new Date(), 'yyyy-LL-dd'),
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);
  }

  @Post(EventNames.PersonalRecordClimbingCreated)
  @Redirect(formatRedirectUrl(EventNames.PersonalRecordClimbingCreated))
  public async createPersonalRecordForClimbing(
    @Body() body: CreatePersonalRecordClimbingDto,
  ) {
    const { name, date } = body;
    const event = jsonEvent<PersonalRecordClimbingCreated>({
      type: EventNames.PersonalRecordClimbingCreated,
      data: {
        id: nanoid(),
        name,
        date: date || format(new Date(), 'yyyy-LL-dd'),
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);
  }

  @Post(EventNames.AdventureCreated)
  @Redirect(formatRedirectUrl(EventNames.AdventureCreated))
  public async createAdventure(@Body() body: CreateAdventureDto) {
    console.log('body', body);
    const { date, activities, name } = body;
    const event = jsonEvent<AdventureCreated>({
      type: EventNames.AdventureCreated,
      data: {
        id: nanoid(),
        date: date || format(new Date(), 'yyyy-LL-dd'),
        activities: typeof activities === 'string' ? [activities] : activities,
        name,
      },
      metadata: {
        importId: nanoid(),
        source: 'USER',
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);
  }
}
