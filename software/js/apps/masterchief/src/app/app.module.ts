import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AdventuresModule } from './adventures/adventures.module';
import { HeroModule } from '../hero/hero.module';
import { ViewModule } from '../react/view.module';

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
    ViewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
