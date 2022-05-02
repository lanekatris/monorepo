import {Injectable, Module} from '@nestjs/common';


import {TypeOrmModule} from "@nestjs/typeorm";

import {CqrsModule} from "@nestjs/cqrs";
import {ConfigModule, ConfigService} from "@nestjs/config";
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import {EventsModule} from "./events/events.module";
import {EventEntity} from "./events/event.entity";

@Module({
  imports: [
    EventsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    ConfigModule.forRoot(),
    //https://github.com/nestjs/nest/issues/1119
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DATABASE'),
        synchronize: true,
          entities: [EventEntity],
          ssl: {
            ca: process.env.SSL_CERT // https://stackoverflow.com/questions/56660312/cannot-connect-an-ssl-secured-database-to-typeorm
          }
      }}
    })
    , CqrsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
