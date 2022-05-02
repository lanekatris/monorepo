import {Injectable, Module} from '@nestjs/common';

import { AppController } from './app.controller';
import {AppService, GetPlacesHandler} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Place} from "./place.entity";
import {CqrsModule} from "@nestjs/cqrs";
import {ConfigModule, ConfigService} from "@nestjs/config";

const QueryHandlers = [GetPlacesHandler];

@Module({
  imports: [ConfigModule.forRoot(),
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
        synchronize: false,
          entities: [Place],
          ssl: {
            ca: process.env.SSL_CERT // https://stackoverflow.com/questions/56660312/cannot-connect-an-ssl-secured-database-to-typeorm
          }
      }}
    })
    , TypeOrmModule.forFeature([Place]), CqrsModule],
  controllers: [AppController],
  providers: [AppService, ...QueryHandlers],
})
export class AppModule {}
