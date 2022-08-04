import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EventName } from '../schema';
import { Inject } from '@nestjs/common';
import { Esdb, ESDB } from '../utils/constants';
import { EventStoreDBClient } from '@eventstore/db-client';
import { AdventureCreated } from '../events/adventure-created';
import { AdventureDeleted } from '../../adventure/types/adventure-deleted';
import { AdventureImportStarted } from '../../adventure/types/adventure-created';
import { MaintenanceCreated } from '../events/maintenance-created';
import { PersonalRecordClimbingCreated } from '../events/personal-record-climbing-created';
import { EventDeleted } from '../events/event-deleted';
import { ChildEventCreated } from '../events/child-event';
import { MovieWatched } from '../events/movie-watched';
import { FoodAte } from '../events/food-ate';
import { NoteTaken } from '../events/note-taken';
import { EventNames } from '../../dg/types/disc-added';
import { EventType } from '@eventstore/db-client/dist/types/events';

export class GetFeedQuery {}

export interface FeedItemV2 {
  eventName: EventName;
  // date: string;
  data: any;
}

interface OptionalDate {
  date?: string;
}

@QueryHandler(GetFeedQuery)
export class GetFeedHandler implements IQueryHandler<GetFeedQuery> {
  constructor(
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}

  async execute(query: GetFeedQuery): Promise<FeedItemV2[]> {
    const events = this.esdb.readStream<
      | AdventureCreated
      | AdventureDeleted
      | AdventureImportStarted
      | MaintenanceCreated
      | PersonalRecordClimbingCreated
      | EventDeleted
      | ChildEventCreated
      | MovieWatched
      | FoodAte
      | NoteTaken
    >(Esdb.StreamEvents);

    let filteredEvents = [];

    // Filter out things where we need access to metadata
    for await (const { event } of events) {
      switch (event.type) {
        case 'event-deleted':
          filteredEvents = filteredEvents.filter(
            (x) => x.data.id !== event.data.eventId,
          );
          break;
        case 'adventure-deleted':
          filteredEvents = filteredEvents.filter(
            (x) => x.data.id !== event.data.id,
          );
          break;
        case 'adventure-import-started':
          filteredEvents = filteredEvents.filter(
            (x) => x.metadata.source !== 'CSV',
          );
          break;
        default:
          filteredEvents.push(event);
          break;
      }
    }

    const feed: FeedItemV2[] = [];
    filteredEvents.forEach((event) => {
      switch (event.type) {
        default:
          feed.push({
            eventName: event.type as EventName,
            data: event.data,
          });
          break;
      }
    });

    // Why sort in memory, can't the DB do that? Well you can create events in the past
    feed.sort((x, y) => {
      const { date: dateX } = x.data as OptionalDate;
      const { date: dateY } = y.data as OptionalDate;

      if (!dateX || !dateY) {
        console.warn('no date', x.data.id, y.data.id);
        return -1;
      }
      return dateY.localeCompare(dateX);
    });

    console.log('feed length', feed.length);

    return feed;
  }
}
