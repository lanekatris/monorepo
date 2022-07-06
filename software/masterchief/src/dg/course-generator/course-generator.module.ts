import { Module } from '@nestjs/common';
import { CourseGeneratorController } from './course-generator.controller';
import { NestMinioModule } from 'nestjs-minio';
import { CoursesByStateService } from './courses-by-state.service';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MinioModule.register({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minio-root-user',
      secretKey: 'minio-root-password',
    }),
    // CoursesByState,
    // CoursesByStateService,
  ],
  providers: [CoursesByStateService],
  controllers: [CourseGeneratorController],
  // exports: [CoursesByStateService],
})
export class CourseGeneratorModule {}
