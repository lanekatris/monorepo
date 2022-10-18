import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Esdb, ESDB, Search } from '../utils/constants';
import {
  EventStoreDBClient,
  PARK,
  persistentSubscriptionToStreamSettingsFromDefaults,
} from '@eventstore/db-client';
import { NoteUploaded } from '../events/note-uploaded';
import { MinioService } from 'nestjs-minio-client';
import JSZip, { loadAsync } from 'jszip';
import { streamToBuffer } from '../utils/stream-to-string';

interface Note {
  source: 'pixel-audio';
  body: string;
}

@Injectable()
export class NoteSubscriber implements OnModuleInit {
  private readonly log = new Logger(NoteSubscriber.name);

  constructor(
    private readonly elastic: ElasticsearchService,
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
    private readonly minioClient: MinioService,
  ) {}

  private async setup() {
    try {
      await this.esdb.createPersistentSubscriptionToStream(
        Esdb.StreamEvents,
        NoteSubscriber.name,
        persistentSubscriptionToStreamSettingsFromDefaults({
          startFrom: 'start',
        }),
      );
      this.log.log(`Created esdb subscription`);
    } catch {
      this.log.log(`Failed to create esdb subscription`);
    }

    this.log.log(`Subscriber READY`);
  }

  @Timeout(100)
  async subscribe() {
    await this.setup();

    const subscription =
      this.esdb.subscribeToPersistentSubscriptionToStream<NoteUploaded>(
        Esdb.StreamEvents,
        NoteSubscriber.name,
      );

    try {
      for await (const event of subscription) {
        try {
          switch (event.event.type) {
            case 'note-uploaded':
              const [bucket, objectName] = event.event.data.filePath.split('/');
              this.log.log(`Processing ${objectName}`);

              const one = await this.minioClient.client.getObject(
                bucket,
                objectName,
              );
              const streamOutput = await streamToBuffer(one);
              const two: JSZip = await loadAsync(streamOutput);
              const fileName = Object.keys(two.files).find((x) =>
                x.includes('.txt'),
              );
              if (!fileName)
                throw new Error(`Txt file not found for ${objectName}`);

              const three = await two.file(fileName).async('text');

              const doc: Note = {
                source: 'pixel-audio',
                body: three,
              };

              const id = objectName.replace(/ /g, '').replace(/\./g, '');

              await this.elastic.update({
                index: Search.IndexNotes,
                id,
                body: {
                  doc,
                  doc_as_upsert: true,
                },
              });
              this.log.log(`${objectName} with id: ${id} elastic upserted`);
              break;
          }

          await subscription.ack(event);
        } catch (err) {
          this.log.error(`Failed processing event: ${err}`, err);
          await subscription.nack(PARK, err.toString(), event);
        }
      }
    } catch (error) {
      this.log.error(`Subscription was dropped. ${error}`);
    }
  }

  async onModuleInit(): Promise<void> {
    await this.createIndices();
    await this.createMappings();
  }

  private async createMappings() {
    await this.elastic.indices.putMapping({
      index: Search.IndexNotes,
      body: {
        _source: {
          enabled: true,
        },
        properties: {
          body: {
            type: 'search_as_you_type',
          },
        },
      },
    });
    this.log.log(`Index mapping created for ${Search.IndexNotes}`);
  }

  private async createIndices() {
    try {
      this.log.log(`Creating elastic index: ${Search.IndexNotes}`);
      await this.elastic.indices.create({
        index: Search.IndexNotes,
      });
    } catch (err) {
      if (err.meta?.body?.error?.type === Search.ErrorIndexAlreadyExists) {
        this.log.log(`Elastic index ${Search.IndexNotes} exists, not creating`);
      } else {
        throw err;
      }
    }
  }
}
