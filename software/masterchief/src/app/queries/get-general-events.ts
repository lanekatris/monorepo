import { Inject, Injectable } from '@nestjs/common';
import {
  AdventureCreated,
  AdventureCreatedData,
} from '../events/adventure-created';
import { AdventureDeleted } from '../../adventure/types/adventure-deleted';
import { AdventureImportStarted } from '../../adventure/types/adventure-created';
import { MaintenanceCreated } from '../events/maintenance-created';
import { PersonalRecordClimbingCreated } from '../events/personal-record-climbing-created';
import { ESDB, Esdb } from '../constants';
import { EventNames } from '../../dg/types/disc-added';
import { EventStoreDBClient } from '@eventstore/db-client';
import { EventDeleted } from '../events/event-deleted';
import { ChildEventCreated } from '../events/child-event';
import { MovieWatched } from '../events/movie-watched';

@Injectable()
export class GetGeneralEvents {
  constructor(
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}
  async get(): Promise<AdventureCreatedData[]> {
    const events = this.esdb.readStream<
      // | AdventureCreated
      | AdventureCreated
      | AdventureDeleted
      | AdventureImportStarted
      | MaintenanceCreated
      | PersonalRecordClimbingCreated
      | EventDeleted
      | ChildEventCreated
      | MovieWatched
    >(Esdb.StreamEvents);
    let generalEvents = [];
    try {
      for await (const { event } of events) {
        switch (event.type) {
          case 'adventure-created':
            generalEvents.unshift(event);
            break;
          case EventNames.AdventureDeleted:
            generalEvents = generalEvents.filter(
              (e) => e.data.id !== event.data.id,
            );
            break;
          case EventNames.AdventureImportStarted:
            generalEvents = generalEvents.filter(
              (e) => e.metadata.source !== 'CSV',
            );
            break;
          case 'maintenance-created':
            generalEvents.unshift({
              data: {
                id: event.data.id,
                activities: [],
                name: event.data.name,
                date: event.data.date,
              },
            });
            break;
          case 'personal-record-climbing-created':
            generalEvents.unshift({
              data: {
                id: event.data.id,
                activities: [],
                name: event.data.name,
                date: event.data.date,
              },
            });
            break;
          case 'event-deleted':
            generalEvents = generalEvents.filter(
              (e) => e.data.id !== event.data.eventId,
            );
            break;
          case 'child-event-created':
            generalEvents.unshift({
              data: {
                id: event.data.id,
                activities: [],
                name: event.data.name,
                date: event.data.date,
              },
            });
            break;
          case 'movie-watched':
            generalEvents.unshift({
              data: {
                id: event.data.id,
                activities: [],
                name: `Watched: ${event.data.name}`,
                date: event.data.date,
              },
            });
            break;
        }
      }
    } catch (err) {
      if (err.type === 'stream-not-found') {
        return [];
      }
      throw err;
    }
    return generalEvents
      .map((x) => x.data)
      .sort((a, b) => a.date - b.date)
      .reverse();
  }
}
