import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { eventStoreFactory } from './event-store';
import { ConfigModule } from '@nestjs/config';
import { DgModule } from './dg/dg.module';

@Module({
  imports: [ConfigModule.forRoot(), DgModule],
  controllers: [],
  providers: [AppService, eventStoreFactory],
})
export class AppModule {}
