import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ViewController } from './view.controller';
import { ViewService } from './view.service';

@Module({
  imports: [],
  providers: [ViewService, ConfigService],
  controllers: [ViewController],
})
export class ViewModule {}