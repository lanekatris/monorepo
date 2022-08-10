import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EventName,
  UiAdventureCreated,
  UiChildEvent,
  UiEventDeleted,
  UiFoodAte,
  UiHairCut,
  UiHealthObservation,
  UiMaintenanceCreated,
  UiMovieWatched,
  UiNoteTaken,
  UiPersonalRecordClimbing,
} from '../schema';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { PersonalRecordClimbingCreated } from '../events/personal-record-climbing-created';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import { MaintenanceCreated } from '../events/maintenance-created';
import { AdventureCreated } from '../events/adventure-created';
import { EventDeleted } from '../events/event-deleted';
import { ESDB, Esdb } from '../utils/constants';
import { Inject, Logger } from '@nestjs/common';
import { BaseEvent } from '../events/base-event';
import { ChildEventCreated } from '../events/child-event';
import { MovieWatched } from '../events/movie-watched';
import { FoodAte } from '../events/food-ate';
import { NoteTaken } from '../events/note-taken';
import { HairCut } from '../events/hair-cut';
import { HealthObservation } from '../events/health-observation';

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
      case 'food-ate':
        const { name, meal, homemade } = body as UiFoodAte;
        event = jsonEvent<FoodAte>({
          type: 'food-ate',
          data: {
            name,
            meal,
            homemade,
            ...baseEventData,
          },
        });
        break;
      case 'note-taken':
        const { body: actualBody } = body as UiNoteTaken;
        event = jsonEvent<NoteTaken>({
          type: 'note-taken',
          data: {
            body: actualBody,
            ...baseEventData,
          },
        });
        break;
      case 'hair-cut': {
        const { name } = body as UiHairCut;
        event = jsonEvent<HairCut>({
          type: 'hair-cut',
          data: {
            name,
            ...baseEventData,
          },
        });
        break;
      }
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
      case 'health-observation': {
        const { body: actualBody, tags } = body as UiHealthObservation;
        event = jsonEvent<HealthObservation>({
          type: 'health-observation',
          data: {
            body: actualBody,
            tags,
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
    } else {
      this.log.log(`NOT appending event to stream`);
    }

    return { event: event.data };
  }
}
