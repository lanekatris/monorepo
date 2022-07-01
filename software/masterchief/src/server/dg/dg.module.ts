import { Module } from '@nestjs/common';
import { DgController } from './dg.controller';
import { ConfigModule } from '@nestjs/config';
import { eventStoreFactory } from '../event-store';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [eventStoreFactory],
  controllers: [DgController],
})
export class DgModule {}
