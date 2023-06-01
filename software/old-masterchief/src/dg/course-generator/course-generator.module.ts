import { forwardRef, Module } from '@nestjs/common';
import { CourseGeneratorController } from './course-generator.controller';
import { CoursesByStateService } from './courses-by-state.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../auth/auth.module';
import { eventStoreFactory } from '../../app/utils/event-store';
import { CourseGeneratorSubscriberService } from './course-generator-subscriber.service';
import { CourseAutocompleteSubscriberService } from './course-autocomplete-subscriber.service';
import { AppModule } from '../../app/app.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    forwardRef(() => AppModule), // Gives us the elasticsearch module
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
