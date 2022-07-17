import { Module } from '@nestjs/common';
import { GeneralEventsController } from './general-events.controller';
import { eventStoreFactory } from '../app/event-store';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [GeneralEventsController],
  providers: [eventStoreFactory],
})
export class GeneralEventsModule {}
