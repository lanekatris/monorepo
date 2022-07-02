import { Inject, Injectable } from '@nestjs/common';
import { DgEvents, EventNames } from './types/disc-added';
import { ESDB } from '../constants';
import { EventStoreDBClient } from '@eventstore/db-client';

@Injectable()
export class DgService {
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
  ) {}

  public async getDiscs() {
    const events = this.client.readStream<DgEvents>('testies');
    let discs = [];

    let discNumber = 1;
    for await (const { event } of events) {
      switch (event.type) {
        case EventNames.DiscAdded:
          discs.push({
            event: event.data,
            discNumber,
          });
          discNumber++;
          break;

        /**
         * Don't decrement disc numbers. Once you add a disc it gets a forever incremented number
         * and nobody else can take it
         */
        case EventNames.DiscRemoved:
          discs = discs.filter((x) => event.data.id !== x.event.id);
          break;
      }
    }
    return discs;
  }
}
