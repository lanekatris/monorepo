import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AdventuresModule } from './adventures/adventures.module';
import { HeroModule } from '../hero/hero.module';
import { RenderModule } from 'nest-next';
import Next from 'next';
import { resolve } from 'path';
import { AppController } from './test.controller';


@Module({
  imports: [
    AdventuresModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
    ConfigModule.forRoot(),
    HeroModule,
    RenderModule.forRootAsync(
      Next({
        dev: process.env.NODE_ENV !== 'production',
        dir: resolve(__dirname),
      })
    ),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
