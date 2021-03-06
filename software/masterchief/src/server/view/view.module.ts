import { Module } from '@nestjs/common';

import { ViewController } from './view.controller';
import { ViewService } from './view.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ViewService],
  controllers: [ViewController],
})
export class ViewModule {}
