import { Module } from '@nestjs/common';
import { DgController } from './dg.controller';
import { ConfigModule } from '@nestjs/config';
import { eventStoreFactory } from '../event-store';
import { DgService } from './dg.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [eventStoreFactory, DgService],
  controllers: [DgController],
})
export class DgModule {}
