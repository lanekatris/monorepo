import {
  Body,
  Controller,
  Inject,
  Logger,
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
import {
  AdventureCreatedData,
  EventDeletedData,
  EventNamesNew,
  MaintenanceCreatedData,
  PersonalRecordClimbingData,
} from '../schema/schema';
import { MetadataType } from '@eventstore/db-client/dist/types/events';

// const Validator = require('jsonschema').Vali
import { validate, Validator } from 'jsonschema';

import jsonSchema from '../schema/schema.json';

export declare type JSONEventTypeIdk<
  Type extends EventNamesNew = EventNamesNew,
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

export type PersonalRecordClimbingCreated = JSONEventTypeIdk<
  'personal-record-climbing-created',
  Omit<PersonalRecordClimbingData, 'eventName'> & JSONType
>;

export type AdventureCreated = JSONEventTypeIdk<
  'adventure-created',
  AdventureCreatedData & JSONType,
  { source: 'CSV' | 'USER'; importId: string }
>;

export type EventDeleted = JSONEventTypeIdk<'event-deleted', EventDeletedData>;

// todo: inherit from class
// export class CreatePersonalRecordClimbingDto {
//   @IsNotEmpty()
//   name: string;
//
//   date: string;
// }
//
// // todo: inherit from class
// export type PersonalRecordClimbingCreated = JSONEventType<
//   EventNames.PersonalRecordClimbingCreated,
//   {
//     id: string;
//     name: string;
//     date: string;
//   }
// >;

// function formatRedirectUrl(event: EventNames) {
//   return `/events?eventName=${event}`;
// }

@Controller('general-events')
@UseGuards(GuardMe)
export class GeneralEventsController {
  private readonly log = new Logger(GeneralEventsController.name);

  constructor(
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}

  // @Post(EventNames.MaintenanceCreated)
  // @Redirect(formatRedirectUrl(EventNames.MaintenanceCreated))
  // public async createMaintenance(@Body() body: MaintenanceCreatedData) {
  //   const { name, date } = body;
  //   const event = jsonEvent<MaintenanceCreated>({
  //     type: 'maintenance-created',
  //     data: {
  //       id: nanoid(),
  //       name,
  //       date: date || format(new Date(), 'yyyy-LL-dd'),
  //     },
  //   });
  //   await this.esdb.appendToStream(Esdb.StreamEvents, event);
  // }
  //
  // @Post(EventNames.PersonalRecordClimbingCreated)
  // @Redirect(formatRedirectUrl(EventNames.PersonalRecordClimbingCreated))
  // public async createPersonalRecordForClimbing(
  //   @Body() body: PersonalRecordClimbingData,
  // ) {
  //   const { name, date } = body;
  //   const event = jsonEvent<PersonalRecordClimbingCreated>({
  //     type: EventNames.PersonalRecordClimbingCreated,
  //     data: {
  //       id: nanoid(),
  //       name,
  //       date: date || format(new Date(), 'yyyy-LL-dd'),
  //     },
  //   });
  //   await this.esdb.appendToStream(Esdb.StreamEvents, event);
  // }

  // @Post(EventNames.AdventureCreated)
  // @Redirect(formatRedirectUrl(EventNames.AdventureCreated))
  // public async createAdventure(@Body() body: CreateAdventureDto) {
  //   console.log('body', body);
  //   const { date, activities, name } = body;
  //   const event = jsonEvent<AdventureCreated>({
  //     type: EventNames.AdventureCreated,
  //     data: {
  //       id: nanoid(),
  //       date: date || format(new Date(), 'yyyy-LL-dd'),
  //       activities: typeof activities === 'string' ? [activities] : activities,
  //       name,
  //     },
  //     metadata: {
  //       importId: nanoid(),
  //       source: 'USER',
  //     },
  //   });
  //   await this.esdb.appendToStream(Esdb.StreamEvents, event);
  // }

  // todo: create a $ref for my base event taht has id and date
  // Can't jsonschema.validate for some reason 🤷
  @Post('create-event')
  public async createEvent(
    @Body() body: { eventName: EventNamesNew; id: string; date: string },
  ) {
    console.log('Create event body', body);

    // const result = validate(body, jsonSchema);
    // if (result.errors.length) {
    //   console.error(result.errors);
    //   throw new Error(`Failed to validate event`);
    // }

    this.log.log(`Processing event name: ${body.eventName}`);

    let event;
    switch (body.eventName) {
      case 'personal-record-climbing-created':
        break;
      case 'maintenance-created':
        break;
      case 'adventure-created':
        const { date, activities, ...data } = body as AdventureCreatedData;

        event = jsonEvent<AdventureCreated>({
          type: 'adventure-created',
          data: {
            ...data, // fix stupid TS error
            // activities:
            //   typeof activities === 'string'
            //     ? [activities]
            //     : activities.split(','),
            // ui gives us a comma seperated string
            // @ts-ignore
            activities: activities.split(','),
            date: date || format(new Date(), 'yyyy-LL-dd'),
            id: nanoid(),
          },
          metadata: {
            importId: nanoid(),
            source: 'USER',
          },
        });
        break;
      case 'event-deleted':
        const { eventId } = body as EventDeletedData;
        event = jsonEvent<EventDeleted>({
          type: 'event-deleted',
          data: {
            id: nanoid(),
            eventId,
            date: format(new Date(), 'yyyy-LL-dd'),
            eventName: 'event-deleted',
          },
        });
        break;
      default:
        throw new Error(`Unknown event name: ${body.eventName}`);
    }

    // sometimes during testing you haven't set data!
    if (event) {
      this.log.log(`Appending event to stream`);
      await this.esdb.appendToStream(Esdb.StreamEvents, event);
    } else {
      this.log.log(`NOT appending event to stream`);
    }

    return { event };
  }
}
