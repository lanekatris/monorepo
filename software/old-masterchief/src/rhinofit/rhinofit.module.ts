import { CacheModule, Injectable, Module } from '@nestjs/common';
import { QueryHandlers } from './queries';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { CommandHandlers } from './commands';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({ load: [configuration] }),
    CacheModule.register(),
  ],
  providers: [...QueryHandlers, ...CommandHandlers],
})
export class RhinofitModule {}
