import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  BUCKET_DG_COURSE_GENERATOR,
  ESDB,
  STREAM_COURSE_GENERATOR,
} from '../../app/constants';
import {
  EventStoreDBClient,
  EventTypeToRecordedEvent,
  jsonEvent,
  PARK,
  persistentSubscriptionToStreamSettingsFromDefaults,
} from '@eventstore/db-client';
import { CoursesByStateService } from './courses-by-state.service';
import { MinioService } from 'nestjs-minio-client';
import { PdgaSyncByStateRequested } from './types/pdga-sync-by-state.requested';
import { PdgaCourseHeaderCreated } from './types/pdga-course-header.created';
import { EventNames } from '../types/disc-added';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { PdgaCourseCached } from './types/pdga-course.cached';
import { Timeout } from '@nestjs/schedule';

function getCourseHeaderCacheKey(courseId: string) {
  return `course/${courseId}.html`;
}

@Injectable()
export class CourseGeneratorSubscriberService {
  private readonly logger = new Logger(CourseGeneratorSubscriberService.name);

  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
    @Inject(CoursesByStateService) private service: CoursesByStateService,
    private readonly minioClient: MinioService,
  ) {}

  public async doesObjectExist(
    bucket: string,
    objectName: string,
  ): Promise<boolean> {
    try {
      await this.minioClient.client.statObject(bucket, objectName);
      return true;
    } catch (err) {
      return false;
    }
  }

  private async processPdgaSyncByStateRequested(
    event: EventTypeToRecordedEvent<PdgaSyncByStateRequested>,
  ) {
    const {
      data: { state },
    } = event;

    const result = await this.service.getCourseHeaders({
      state,
    });

    // todo: don't create the events if they already exist on the stream? or does it matter if we just hit cache?
    const events = result.courseHeaders.map((courseHeader) =>
      jsonEvent(<PdgaCourseHeaderCreated>{
        type: EventNames.PdgaCourseHeaderCreated,
        data: {
          id: nanoid(),
          courseHeader,
        },
      }),
    );
    this.logger.log(`Creating ${events.length} events for ${state}`);
    await this.client.appendToStream(STREAM_COURSE_GENERATOR, events);
  }

  private async processPdgaCourseHeaderCreated(
    event: EventTypeToRecordedEvent<PdgaCourseHeaderCreated>,
  ) {
    const isCached = await this.doesObjectExist(
      BUCKET_DG_COURSE_GENERATOR,
      getCourseHeaderCacheKey(event.data.courseHeader.id),
    );
    this.logger.log(
      `${event.data.courseHeader.name} is cached: ${isCached} in ${event.data.courseHeader.state}`,
    );
    if (!isCached) {
      const url = `https://www.pdga.com${event.data.courseHeader.courseUrl}`;
      this.logger.warn(`Getting course html: ${url}`);
      const { data } = await axios.get(url);
      await this.minioClient.client.putObject(
        BUCKET_DG_COURSE_GENERATOR,
        getCourseHeaderCacheKey(event.data.courseHeader.id),
        data,
      );
    }

    // let's tell everybody its cached so we don't have to query our minio
    const cachedEvent = jsonEvent<PdgaCourseCached>({
      type: EventNames.PdgaCourseCached,
      data: {
        id: nanoid(),
        courseId: event.data.courseHeader.id,
      },
    });
    await this.client.appendToStream(STREAM_COURSE_GENERATOR, cachedEvent);
  }

  // Do not use OnModuleInit, that will cause the app to hang since it locks the thread I assume
  @Timeout(100)
  async subscribe() {
    try {
      await this.client.createPersistentSubscriptionToStream(
        STREAM_COURSE_GENERATOR,
        CourseGeneratorSubscriberService.name,
        persistentSubscriptionToStreamSettingsFromDefaults({
          startFrom: 'start',
        }),
      );
      this.logger.log(`Created esdb subscription`);
    } catch {
      this.logger.log(`Failed to create esdb subscription`);
    }

    this.logger.log(`Subscriber READY`);

    const subscription = this.client.subscribeToPersistentSubscriptionToStream<
      PdgaSyncByStateRequested | PdgaCourseHeaderCreated
    >(STREAM_COURSE_GENERATOR, CourseGeneratorSubscriberService.name);
    try {
      for await (const event of subscription) {
        try {
          switch (event.event.type) {
            case EventNames.PdgaSyncByStateRequested:
              await this.processPdgaSyncByStateRequested(event.event);
              break;
            case EventNames.PdgaCourseHeaderCreated:
              await this.processPdgaCourseHeaderCreated(event.event);
              break;
          }

          await subscription.ack(event);
        } catch (error) {
          console.error(error);
          this.logger.error(`Failed processing event: ${error}`, error);
          await subscription.nack(PARK, error.toString(), event);
        }
      }
    } catch (error) {
      this.logger.error(`Subscription was dropped. ${error}`);
    }
  }
}
