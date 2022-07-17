import { Module } from '@nestjs/common';
import { AdventureController } from './adventure.controller';
import { AuthModule } from '../auth/auth.module';
import { eventStoreFactory } from '../app/event-store';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  providers: [eventStoreFactory],
  controllers: [AdventureController],
})
export class AdventureModule {}
