import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseGeneratorController } from './course-generator.controller';
import { CoursesByStateService } from './courses-by-state.service';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { AuthModule } from '../../auth/auth.module';
import { eventStoreFactory } from '../../app/event-store';
import { CourseGeneratorSubscriberService } from './course-generator-subscriber.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { CourseAutocompleteSubscriberService } from './course-autocomplete-subscriber.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MinioModule.register({
      endPoint: process.env.MINIO_URL,
      port: 9000,
      useSSL: false,
      accessKey: 'minio-root-user',
      secretKey: 'minio-root-password',
    }),
    AuthModule,
    ElasticsearchModule.register({
      node: process.env.ELASTIC_URL,
    }),
  ],
  providers: [
    CoursesByStateService,
    eventStoreFactory,
    CourseGeneratorSubscriberService,
    CourseAutocompleteSubscriberService,
  ],
  controllers: [CourseGeneratorController],
})
export class CourseGeneratorModule {}
