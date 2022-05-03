import { Inject, Injectable, Logger } from '@nestjs/common';
import { AdventureCreated } from './events/adventure-created';
import {
  EventStoreDBClient,
  FORWARDS,
  jsonEvent,
  START,
} from '@eventstore/db-client';
import { Adventure, CreateAdventureInput } from './models/adventure';
import { isSameDay } from 'date-fns';
import { merge } from 'lodash';
import {ESDB} from "../constants";

@Injectable()
export class AdventureService {
  private readonly logger = new Logger(AdventureService.name);
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient
  ) {}

  async get(): Promise<Adventure[]> {
    const events = this.client.readStream<AdventureCreated>('testies', {
      direction: FORWARDS,
      fromRevision: START,
      maxCount: 1000,
    });

    const adventures: Adventure[] = [];

    let count = 0;
    for await (const { event } of events) {
      count++;
      switch (event.type) {
        case 'AdventureCreated': {
          const sameDay = adventures.find((x) =>
            isSameDay(event.data.date, x.date)
          );
          if (sameDay) {
            sameDay.activities = merge(
              sameDay.activities,
              event.data.activities
            );
          } else {
            adventures.push({
              id: event.id,
              date: new Date(event.data.date),
              activities: event.data.activities,
            });
          }
          break;
        }
      }
    }

    this.logger.log(
      `Returning ${adventures.length} adventure for ${count} events`
    );
    return adventures;
  }

  async create(input: CreateAdventureInput): Promise<boolean> {
    const event = jsonEvent<AdventureCreated>({
      type: 'AdventureCreated',
      data: {
        date: input.date || new Date(),
        activities: input.activities,
      },
    });
    await this.client.appendToStream('testies', event);
    this.logger.log(`Created adventure: ${JSON.stringify(event.data)}`);
    return true;
  }
}
