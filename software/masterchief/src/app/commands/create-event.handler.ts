import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EventName,
  UiAdventureCreated,
  UiChildEvent,
  UiEventDeleted,
  UiMaintenanceCreated,
  UiMovieWatched,
  UiPersonalRecordClimbing,
} from '../../schema/schema';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { PersonalRecordClimbingCreated } from '../events/personal-record-climbing-created';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import { MaintenanceCreated } from '../events/maintenance-created';
import { AdventureCreated } from '../events/adventure-created';
import { EventDeleted } from '../events/event-deleted';
import { ESDB, Esdb } from '../constants';
import { Inject, Logger } from '@nestjs/common';
import { BaseEvent } from '../events/base-event';
import { ChildEventCreated } from '../events/child-event';
import { MovieWatched } from '../events/movie-watched';

export class CreateEventCommand {
  constructor(public eventName: EventName, public body: { date?: string }) {}
}

@CommandHandler(CreateEventCommand)
export class CreateEventHandler implements ICommandHandler<CreateEventCommand> {
  private readonly log = new Logger(CreateEventHandler.name);

  constructor(@Inject(ESDB) private esdb: EventStoreDBClient) {}

  async execute({ eventName, body }: CreateEventCommand) {
    console.log('Create event body', body);
    this.log.log(`Processing event name: ${eventName}`);

    const baseEventData: BaseEvent = {
      id: nanoid(),
      date: body.date || format(new Date(), 'yyyy-LL-dd'),
    };

    let event;
    switch (eventName) {
      case 'personal-record-climbing-created': {
        const { name } = body as UiPersonalRecordClimbing;
        event = jsonEvent<PersonalRecordClimbingCreated>({
          type: 'personal-record-climbing-created',
          data: {
            name,
            ...baseEventData,
          },
        });
        break;
      }

      case 'maintenance-created': {
        const { name, equipment } = body as UiMaintenanceCreated;
        event = jsonEvent<MaintenanceCreated>({
          type: 'maintenance-created',
          data: {
            // ...(rest as MaintenanceCreatedData),
            name,
            equipment,
            ...baseEventData,
          },
        });
        break;
      }
      case 'adventure-created': {
        const { name, activities: stringActivities } =
          body as UiAdventureCreated;

        event = jsonEvent<AdventureCreated>({
          type: 'adventure-created',
          data: {
            name,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            activities: stringActivities?.split(','),
            ...baseEventData,
          },
          metadata: {
            importId: nanoid(),
            source: 'USER',
          },
        });
        break;
      }
      case 'event-deleted':
        const { eventId } = body as UiEventDeleted;
        event = jsonEvent<EventDeleted>({
          type: 'event-deleted',
          data: {
            eventId,
            ...baseEventData,
          },
        });
        break;
      case 'child-event-created': {
        const { name } = body as UiChildEvent;
        event = jsonEvent<ChildEventCreated>({
          type: 'child-event-created',
          data: {
            name,
            ...baseEventData,
          },
        });
        break;
      }
      case 'movie-watched': {
        const { name } = body as UiMovieWatched;
        event = jsonEvent<MovieWatched>({
          type: 'movie-watched',
          data: {
            name,
            ...baseEventData,
          },
        });
        break;
      }

      default:
        throw new Error(`Unknown event name: ${eventName}`);
    }

    // sometimes during testing you haven't set data!
    if (event) {
      this.log.log(`Appending event to stream`);
      await this.esdb.appendToStream(Esdb.StreamEvents, event);
      // console.log('event to create', event.data);
    } else {
      this.log.log(`NOT appending event to stream`);
    }

    return { event: event.data };
  }
}
