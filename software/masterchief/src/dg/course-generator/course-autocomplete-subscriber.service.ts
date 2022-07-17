import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ESDB, Search, STREAM_COURSE_GENERATOR } from '../../app/constants';
import {
  EventStoreDBClient,
  PARK,
  persistentSubscriptionToStreamSettingsFromDefaults,
} from '@eventstore/db-client';
import { PdgaCourseHeaderCreated } from './types/pdga-course-header.created';
import { EventNames } from '../types/disc-added';
import { PdgaCourseAutocomplete } from './types/pdga-course-autocomplete';

@Injectable()
export class CourseAutocompleteSubscriberService implements OnModuleInit {
  private readonly log = new Logger(CourseAutocompleteSubscriberService.name);

  constructor(
    private readonly elastic: ElasticsearchService,
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}
  // subscribe to esdb events
  @Timeout(100)
  async subscribe() {
    try {
      await this.esdb.createPersistentSubscriptionToStream(
        STREAM_COURSE_GENERATOR,
        CourseAutocompleteSubscriberService.name,
        persistentSubscriptionToStreamSettingsFromDefaults({
          startFrom: 'start',
        }),
      );
      this.log.log(`Created esdb subscription`);
    } catch {
      this.log.log(`Failed to create esdb subscription`);
    }

    this.log.log(`Subscriber READY`);

    const subscription =
      this.esdb.subscribeToPersistentSubscriptionToStream<PdgaCourseHeaderCreated>(
        STREAM_COURSE_GENERATOR,
        CourseAutocompleteSubscriberService.name,
      );
    try {
      for await (const event of subscription) {
        try {
          switch (event.event.type) {
            case EventNames.PdgaCourseHeaderCreated:
              const { name, id } = event.event.data.courseHeader;
              const doc: PdgaCourseAutocomplete = {
                pdgaId: id,
                name,
              };
              await this.elastic.update({
                index: Search.IndexDiscGolfCourseAutocomplete,
                id: doc.pdgaId,
                body: {
                  doc,
                  doc_as_upsert: true,
                },
              });
              this.log.log(
                `Upserted elastic autocomplete for course id: ${id}`,
              );
              break;
          }

          await subscription.ack(event);
        } catch (error) {
          // console.error(error);
          this.log.error(`Failed processing event: ${error}`, error);
          await subscription.nack(PARK, error.toString(), event);
        }
      }
    } catch (error) {
      this.log.error(`Subscription was dropped. ${error}`);
    }
  }

  // todo: on module init, create the index
  async onModuleInit(): Promise<void> {
    await this.createIndices();
    await this.createMappings();
  }

  private async createMappings() {
    await this.elastic.indices.putMapping({
      index: Search.IndexDiscGolfCourseAutocomplete,
      body: {
        properties: {
          name: {
            type: 'search_as_you_type',
          },
          pdgaId: {
            type: 'search_as_you_type',
          },
        },
      },
    });
    this.log.log(
      `Index mapping created for ${Search.IndexDiscGolfCourseAutocomplete}`,
    );
  }

  private async createIndices() {
    try {
      this.log.log(
        `Creating elastic index: ${Search.IndexDiscGolfCourseAutocomplete}`,
      );
      await this.elastic.indices.create({
        index: Search.IndexDiscGolfCourseAutocomplete,
      });
    } catch (err) {
      if (err.meta?.body?.error?.type === Search.ErrorIndexAlreadyExists) {
        this.log.log(
          `Elastic index ${Search.IndexDiscGolfCourseAutocomplete} exists, not creating`,
        );
      } else {
        throw err;
      }
    }
  }
}
