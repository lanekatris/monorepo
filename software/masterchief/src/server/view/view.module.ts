import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { eventStoreFactory } from '../event-store';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ViewService, eventStoreFactory],
  controllers: [ViewController],
})
export class ViewModule {}
