import { Module } from '@nestjs/common';
import { AdventuresResolver } from './adventures.resolver';
import { AdventureService } from './adventure-service';
import { eventStoreFactory } from '../event-store';

@Module({
  imports: [],
  providers: [eventStoreFactory, AdventureService, AdventuresResolver],
})
export class AdventuresModule {}
