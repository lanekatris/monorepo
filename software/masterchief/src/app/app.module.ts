import { Module } from '@nestjs/common';

import { eventStoreFactory } from './utils/event-store';
import { ConfigModule } from '@nestjs/config';
import { DgModule } from '../dg/dg.module';
import { ClimbModule } from '../climb/climb.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AdventureModule } from '../adventure/adventure.module';
import { GetGeneralEvents } from './queries/get-general-events';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DgModule,
    ClimbModule,
    AuthModule,
    AdventureModule,
    CqrsModule,
  ],
  controllers: [AppController],
  providers: [
    eventStoreFactory,
    GetGeneralEvents,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class AppModule {}
