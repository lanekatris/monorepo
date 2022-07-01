import { Inject, Injectable } from '@nestjs/common';
import { DiscAdded } from './types/disc-added';
import { ESDB } from '../constants';
import { EventStoreDBClient } from '@eventstore/db-client';

@Injectable()
export class DgService {
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
  ) {}

  public async getDiscs() {
    const events = this.client.readStream<DiscAdded>('testies');
    const discs = [];

    let discNumber = 1;
    for await (const { event } of events) {
      switch (event.type) {
        case 'disc-added':
          discs.push({
            event: event.data,
            discNumber,
          });
          discNumber++;
          break;
      }
    }
    return discs;
  }
}
