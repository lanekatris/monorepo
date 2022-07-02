import { Module } from '@nestjs/common';
import { ClimbController } from './climb.controller';
import { eventStoreFactory } from '../event-store';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ClimbController],
  providers: [eventStoreFactory],
})
export class ClimbModule {}
