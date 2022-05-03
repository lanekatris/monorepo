import { Module } from '@nestjs/common';
import { AdventuresResolver } from './adventures.resolver';
import { AdventureService } from './adventure-service';
import { eventStoreFactory } from '../event-store';
import { ConfigModule } from '@nestjs/config';
import {AdventureSubscriberService} from "./adventure-subscriber.service";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [eventStoreFactory, AdventureService, AdventureSubscriberService, AdventuresResolver],
})
export class AdventuresModule {}
