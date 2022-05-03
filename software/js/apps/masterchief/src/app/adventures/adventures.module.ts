import { Module } from '@nestjs/common';
import { AdventuresResolver } from './adventures.resolver';
import { AdventureService } from './adventure-service';
import { eventStoreFactory } from '../event-store';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [eventStoreFactory, AdventureService, AdventuresResolver],
})
export class AdventuresModule {}
