import { Module } from '@nestjs/common';

import { eventStoreFactory } from './utils/event-store';
import { ConfigModule } from '@nestjs/config';
import { DgModule } from '../dg/dg.module';
import { ClimbModule } from '../climb/climb.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AdventureModule } from '../adventure/adventure.module';
import { GetGeneralEvents } from './queries/get-general-events';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { MinioModule } from 'nestjs-minio-client';
import { Subscribers } from './subscribers';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppQueriesResolver } from './app.queries.resolver';
import { AppMutationResolver } from './app.mutation.resolver';

const spaPath = join(__dirname, '..', '..', '..', 'frontend', 'dist');

@Module({
  imports: [
    ConfigModule.forRoot(),
    DgModule,
    ClimbModule,
    AuthModule,
    AdventureModule,
    CqrsModule,
    ScheduleModule.forRoot(),
    MinioModule.register({
      global: true, // Needed for child modules to reference
      endPoint: process.env.MINIO_URL,
      port: Number(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: 'minio-root-user',
      secretKey: 'minio-root-password',
    }),
    ElasticsearchModule.register({
      node: process.env.ELASTIC_URL,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(spaPath),
      exclude: ['/api*', '/graphql'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    eventStoreFactory,
    GetGeneralEvents,
    ...QueryHandlers,
    ...CommandHandlers,
    ...Subscribers,
    AppQueriesResolver,
    AppMutationResolver,
  ],
  exports: [ElasticsearchModule],
})
export class AppModule {}
