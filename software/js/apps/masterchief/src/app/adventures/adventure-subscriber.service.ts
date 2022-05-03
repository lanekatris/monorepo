import {Inject, Injectable, Logger, OnModuleInit} from "@nestjs/common";
import {ESDB} from "../constants";
import {EventStoreDBClient, excludeSystemEvents} from "@eventstore/db-client";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AdventureSubscriberService implements OnModuleInit{
  private readonly logger = new Logger(AdventureSubscriberService.name);

  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient, private config: ConfigService
  ) {
  }

  async onModuleInit() {
    if (this.config.get('ADVENTURE_SUBSCRIBER_ENABLED') !== 'true'){
      this.logger.log(`Not starting adventure subscriber`)
      return;
    }

    const subscription = this.client.subscribeToAll({filter: excludeSystemEvents()});

    let count = 0
    for await (const resolvedEvent of subscription) {
      count++;
      this.logger.log(`read ${count} events --> ${resolvedEvent.event?.revision}@${resolvedEvent.event?.streamId}`)
    }
  }
}
