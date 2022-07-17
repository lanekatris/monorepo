import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { eventStoreFactory } from './event-store';
import { ConfigModule } from '@nestjs/config';
import { DgModule } from '../dg/dg.module';
import { ClimbModule } from '../climb/climb.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AdventureModule } from '../adventure/adventure.module';
import { GeneralEventsModule } from '../general-events/general-events.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DgModule,
    ClimbModule,
    AuthModule,
    AdventureModule,
    GeneralEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, eventStoreFactory],
})
export class AppModule {}
