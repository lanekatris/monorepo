import { Module } from '@nestjs/common';
import { DgController } from './dg.controller';
import { ConfigModule } from '@nestjs/config';
import { eventStoreFactory } from '../app/event-store';
import { DgService } from './dg.service';
import { GeneratorController } from './generator.controller';
import { CourseGeneratorModule } from './course-generator/course-generator.module';
import { NestMinioModule } from 'nestjs-minio';
import { AuthModule } from '../auth/auth.module';

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
    AuthModule,
  ],
  providers: [eventStoreFactory, DgService],
  controllers: [DgController, GeneratorController],
})
export class DgModule {}
