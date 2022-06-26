import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { ViewModule } from './view/view.module';
import { eventStoreFactory } from './event-store';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ViewModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [AppService, eventStoreFactory],
})
export class AppModule {}
