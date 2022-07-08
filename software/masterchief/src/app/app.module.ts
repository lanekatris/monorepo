import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { eventStoreFactory } from './event-store';
import { ConfigModule } from '@nestjs/config';
import { DgModule } from '../dg/dg.module';
import { ClimbModule } from '../climb/climb.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot(), DgModule, ClimbModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, eventStoreFactory],
})
export class AppModule {}
