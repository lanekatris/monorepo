import { Module } from '@nestjs/common';
import { CourseGeneratorController } from './course-generator.controller';
import { CoursesByStateService } from './courses-by-state.service';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MinioModule.register({
      endPoint: process.env.MINIO_URL,
      port: 9000,
      useSSL: false,
      accessKey: 'minio-root-user',
      secretKey: 'minio-root-password',
    }),
    AuthModule,
  ],
  providers: [CoursesByStateService],
  controllers: [CourseGeneratorController],
  // exports: [CoursesByStateService],
})
export class CourseGeneratorModule {}
