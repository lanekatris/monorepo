import {
  Controller,
  Get,
  Inject,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StateAbbreviations } from '../stateAbbreviations';
import { CoursesByStateService } from './courses-by-state.service';
import { MinioService } from 'nestjs-minio-client';
import axios from 'axios';
import { GuardMe } from '../../auth/guard-me.guard';
import {
  ESDB,
  Search,
  STREAM_COURSE_GENERATOR,
} from '../../app/utils/constants';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { EventNames } from '../types/disc-added';
import { nanoid } from 'nanoid';
import { PdgaCourseCached } from './types/pdga-course.cached';
import { PdgaSyncByStateRequested } from './types/pdga-sync-by-state.requested';
import { PdgaCourseHeaderCreated } from './types/pdga-course-header.created';
import { ElasticsearchService } from '@nestjs/elasticsearch';

axios.interceptors.request.use((request) => {
  const url = new URL(request.url);

  const params = new URLSearchParams(request.url);
  const keysForDel = [];
  params.forEach((value, key) => {
    if (value == '' || value == 'All') {
      keysForDel.push(key);
    }
  });

  keysForDel.forEach((key) => {
    params.delete(key);
  });

  console.log(
    `Requesting: ${url.origin}${url.pathname} with ${params.toString()}`,
  );
  return request;
});

@Controller('dg/course-generator')
@UseGuards(GuardMe)
export class CourseGeneratorController {
  private readonly log = new Logger(CourseGeneratorController.name);

  constructor(
    @Inject(CoursesByStateService) private service: CoursesByStateService,
    private readonly minioClient: MinioService,

    @Inject(ESDB)
    private esdb: EventStoreDBClient,

    private readonly elastic: ElasticsearchService,
  ) {}

  @Get(EventNames.PdgaSyncByStateRequested)
  async previewPdgaDataSync() {
    this.log.log(`Sending Event: ${EventNames.PdgaSyncByStateRequested}`);
    const states = Object.values(StateAbbreviations);
    const events = states.map((state) =>
      jsonEvent<PdgaSyncByStateRequested>({
        type: EventNames.PdgaSyncByStateRequested,
        data: {
          id: nanoid(),
          state,
        },
      }),
    );
    await this.esdb.appendToStream(STREAM_COURSE_GENERATOR, events);
    return 'success';
  }

  @Get('pdga-sync-status')
  async getSome() {
    const events = this.esdb.readStream<
      PdgaSyncByStateRequested | PdgaCourseHeaderCreated | PdgaCourseCached
    >(STREAM_COURSE_GENERATOR);

    const model: { courseId: string; cached: boolean }[] = [];
    for await (const { event } of events) {
      switch (event.type) {
        case EventNames.PdgaSyncByStateRequested:
          break;
        case EventNames.PdgaCourseHeaderCreated:
          if (!model.find((x) => x.courseId === event.data.courseHeader.id)) {
            model.push({ courseId: event.data.courseHeader.id, cached: false });
          }

          break;
        case EventNames.PdgaCourseCached:
          const a = model.find((x) => x.courseId == event.data.courseId);
          if (a) {
            a.cached = true;
          }
          break;
      }
    }
    return {
      count: model.length,
      cachedCount: model.filter((x) => x.cached).length,
      nonCachedCount: model.filter((x) => !x.cached).length,
      idk: model,
    };
  }

  @Get('courses/autocomplete')
  async elasticTest(@Query('query') query) {
    const result = await this.elastic.search({
      index: Search.IndexDiscGolfCourseAutocomplete,
      size: 10,
      body: {
        query: {
          multi_match: {
            query,
            type: 'bool_prefix',
            fields: ['name', 'pdgaId'],
          },
        },
      },
    });

    return result.body.hits.hits.map((hit) => hit._source);
  }
}
