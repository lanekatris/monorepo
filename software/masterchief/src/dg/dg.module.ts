import { Module } from '@nestjs/common';
import { DgController } from './dg.controller';
import { ConfigModule } from '@nestjs/config';
import { eventStoreFactory } from '../event-store';
import { DgService } from './dg.service';
import { GeneratorController } from './generator.controller';
import { MulterModule } from '@nestjs/platform-express';
import { CourseGeneratorModule } from './course-generator/course-generator.module';
import { NestMinioModule } from 'nestjs-minio';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NestMinioModule.register({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false,
      accessKey: 'minio-root-user',
      secretKey: 'minio-root-password',
    }),
    CourseGeneratorModule,
  ],
  providers: [eventStoreFactory, DgService],
  controllers: [DgController, GeneratorController],
})
export class DgModule {}
