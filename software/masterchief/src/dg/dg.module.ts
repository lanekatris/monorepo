import { Module } from '@nestjs/common';
import { DgController } from './dg.controller';
import { ConfigModule } from '@nestjs/config';
import { eventStoreFactory } from '../app/utils/event-store';
import { DgService } from './dg.service';
import { GeneratorController } from './generator.controller';
import { CourseGeneratorModule } from './course-generator/course-generator.module';
import { AuthModule } from '../auth/auth.module';
import { DgResolver } from './dg.resolver';

@Module({
  imports: [ConfigModule.forRoot(), CourseGeneratorModule, AuthModule],
  providers: [eventStoreFactory, DgService, DgResolver],
  controllers: [DgController, GeneratorController],
  exports: [DgService],
})
export class DgModule {}
