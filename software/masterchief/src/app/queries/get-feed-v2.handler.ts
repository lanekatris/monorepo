import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Esdb, ESDB } from '../utils/constants';
import { EventStoreDBClient, JSONEventType } from '@eventstore/db-client';
import { Field, ID, Int, InterfaceType, ObjectType } from '@nestjs/graphql';
import { readStream } from '../utils/event-store';
import { EventNames } from '../../dg/types/disc-added';
import { nanoid } from 'nanoid';

export class GetFeedQueryV2 {
  constructor(public types: EventNames[]) {}
}

@ObjectType()
export class FeedResponse {
  @Field(() => Int)
  public get total() {
    return this.events.length;
  }
  @Field(() => [FeedEvent])
  public events: FeedEvent[];

  constructor(events: FeedEvent[]) {
    this.events = events;
  }
}

@ObjectType()
export class Tag {
  @Field()
  id: string;
  @Field()
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

@InterfaceType()
export abstract class FeedEvent {
  @Field(() => ID)
  id: string;
  @Field()
  date: string;

  dbType: EventNames;

  @Field({ nullable: true })
  deleted?: boolean;

  @Field(() => [Tag], { nullable: true })
  tags?: Tag[];
}

@ObjectType({ implements: () => [FeedEvent] })
export class HealthObservationEvent implements FeedEvent {
  @Field(() => ID)
  id: string;
  @Field()
  name: string;
  @Field()
  date: string;

  constructor(id: string, name: string, date: string, dbType: EventNames) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.dbType = dbType;
  }

  dbType: EventNames;
}

@ObjectType({ implements: () => [FeedEvent] })
export class ChildEvent implements FeedEvent {
  @Field()
  date: string;
  @Field(() => ID)
  id: string;
  @Field()
  name: string;

  constructor(id: string, name: string, date: string, dbType: EventNames) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.dbType = dbType;
  }

  dbType: EventNames;
}

@ObjectType({ implements: () => [FeedEvent] })
export class MovieWatchedEvent implements FeedEvent {
  @Field()
  date: string;
  @Field(() => ID)
  id: string;
  @Field()
  name: string;

  dbType: EventNames;

  constructor(id: string, name: string, date: string, dbType: EventNames) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.dbType = dbType;
  }
}

@ObjectType({ implements: () => [FeedEvent] })
export class UnknownEvent implements FeedEvent {
  constructor(public id: string, public date: string) {}

  dbType: EventNames;
}

export type EventMessageUpdated = JSONEventType<
  EventNames.EventMessageUpdated,
  {
    id: string;
    date: string;
    eventId: string;
    message: string;
  }
>;
export type EventTagCreated = JSONEventType<
  EventNames.EventTagCreated,
  {
    id: string;
    date: string;
    eventId: string;
    tag: string;
  }
>;

export type EventTagRemoved = JSONEventType<
  EventNames.EventTagRemoved,
  {
    id: string;
    date: string;
    eventId: string;
    tagId: string;
  }
>;

export type LanesCustomEvents =
  | {
      type: EventNames.HealthObservation;
      data: {
        id: string;
        body: string;
        tags: string[];
        date: string;
      };
    }
  | {
      type: EventNames.EventDeleted;
      data: {
        eventId: string;
      };
    }
  | {
      type: EventNames.ChildEventCreated;
      data: {
        id: string;
        date: string;
        name: string;
      };
    }
  | EventMessageUpdated
  | {
      type: EventNames.MovieWatched;
      data: {
        id: string;
        date: string;
        name: string;
      };
    }
  | EventTagCreated
  | EventTagRemoved;
// | {
//     type: EventNames.EventMessageUpdated;
//     data: {
//       id: string;
//       date: string;
//       eventId: string;
//       message: string;
//     };
//   };

const evolve = (
  currentState: FeedEvent[],
  event: LanesCustomEvents,
): FeedEvent[] => {
  switch (event.type) {
    case EventNames.EventTagRemoved: {
      const existingEvent = currentState.find(
        (x) => x.id === event.data.eventId,
      );
      if (existingEvent?.tags) {
        existingEvent.tags = existingEvent.tags.filter(
          (x) => x.id !== event.data.tagId,
        );
      }
      break;
    }
    case EventNames.EventTagCreated: {
      const existingEvent = currentState.find(
        (x) => x.id === event.data.eventId,
      );
      if (existingEvent) {
        // const existingTag = existingEvent.tags.find(x => x.id === event.data.)
        if (existingEvent.tags) {
          existingEvent.tags.push(new Tag(event.data.id, event.data.tag));
        } else {
          existingEvent.tags = [new Tag(event.data.id, event.data.tag)];
        }
      }
      break;
    }
    case EventNames.MovieWatched: {
      currentState.push(
        new MovieWatchedEvent(
          event.data.id,
          event.data.name,
          event.data.date,
          event.type,
        ),
      );
      break;
    }

    case 'health-observation':
      currentState.push(
        new HealthObservationEvent(
          event.data.id,
          event.data.body,
          event.data.date,
          event.type,
        ),
      );
      break;
    case 'event-deleted':
      currentState = currentState.filter((x) => x.id !== event.data.eventId);
      break;
    case 'child-event-created':
      currentState.push(
        new ChildEvent(
          event.data.id,
          event.data.name,
          event.data.date,
          event.type,
        ),
      );
      break;
    case EventNames.EventMessageUpdated: {
      // find it, if it exists edit it
      const existingEvent = currentState.find(
        (x) => x.id === event.data.eventId,
      );
      if (existingEvent) {
        console.log('do work', { existingEvent, event });
        if ('name' in existingEvent) {
          // @ts-ignore
          existingEvent.name = event.data.message;
        }
      }
      console.log('nothing');
      break;
    }

    default:
      break;
  }
  return currentState;
};

@QueryHandler(GetFeedQueryV2)
export class GetFeedHandlerV2 implements IQueryHandler<GetFeedQueryV2> {
  constructor(
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}

  async execute(query: GetFeedQueryV2): Promise<FeedEvent[]> {
    const { types } = query;

    const events = await readStream<LanesCustomEvents>(
      this.esdb,
      Esdb.StreamEvents,
    );
    return events
      .reduce<FeedEvent[]>(evolve, [])
      .filter((e) => {
        if (!types.length) return true;
        return types.includes(e.dbType);
      })
      .sort((x, y) => {
        const dateX = x.date;
        const dateY = y.date;
        return dateY.localeCompare(dateX);
      });
  }
}
