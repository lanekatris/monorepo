import { Inject, Injectable, Logger } from '@nestjs/common';
import { DgEvents, EventNames } from './types/disc-added';
import { ESDB } from '../constants';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { CourseAdded } from './types/course-added';
import { CoursePlayed, CoursePlayedSource } from './types/course-played';
import { nanoid } from 'nanoid';
import { CourseExcluded } from './types/course-excluded';

@Injectable()
export class DgService {
  private readonly logger = new Logger(DgService.name);
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
  ) {}

  public async getDiscs() {
    const events = this.client.readStream<DgEvents>('testies');
    let discs = [];

    let discNumber = 1;
    for await (const { event } of events) {
      switch (event.type) {
        case EventNames.DiscAdded:
          discs.push({
            event: event.data,
            discNumber,
          });
          discNumber++;
          break;

        /**
         * Don't decrement disc numbers. Once you add a disc it gets a forever incremented number
         * and nobody else can take it
         */
        case EventNames.DiscRemoved:
          discs = discs.filter((x) => event.data.id !== x.event.id);
          break;
        case EventNames.DiscsReset:
          discs.length = 0;
          discNumber = 1;
          break;
      }
    }
    return discs;
  }

  public async getAllCourseIds(): Promise<string[]> {
    const allPdgaIds = [];
    const events = this.client.readStream<CourseAdded>('dg-testies-dataload');
    for await (const { event } of events) {
      switch (event.type) {
        case EventNames.CourseAdded:
          allPdgaIds.push(event.data.id);
          break;
      }
    }
    return allPdgaIds;
  }

  public async getPlayedCourses(): Promise<string[]> {
    const courseIds = [];
    const events = this.client.readStream<CoursePlayed>('my-courses-2');

    try {
      for await (const { event } of events) {
        switch (event.type) {
          case EventNames.CoursePlayed:
            courseIds.push(event.data.courseId);
            break;
        }
      }
    } catch (err) {
      if (err.type === 'stream-not-found') {
        this.logger.log('climbs stream not found');
        return [];
      }
      throw err;
    }
    return courseIds.sort();
  }

  public async getManualPlayedCourses(): Promise<string[]> {
    const courseIds = [];
    const events = this.client.readStream<CoursePlayed>('my-courses-2');

    try {
      for await (const { event } of events) {
        switch (event.type) {
          case EventNames.CoursePlayed:
            if (event.data.source === CoursePlayedSource.Manual)
              courseIds.push(event.data.courseId);
            break;
        }
      }
    } catch (err) {
      if (err.type === 'stream-not-found') {
        this.logger.log('climbs stream not found');
        return [];
      }
      throw err;
    }
    return courseIds.sort();
  }

  public async coursePlayed(
    pdgaCourseId: string,
    source: CoursePlayedSource,
  ): Promise<void> {
    // todo: this is very bad, don't do this
    const playedCourseIds = await this.getPlayedCourses();
    if (playedCourseIds.includes(pdgaCourseId)) return;

    const event = jsonEvent<CoursePlayed>({
      type: EventNames.CoursePlayed,
      data: {
        id: nanoid(),
        courseId: pdgaCourseId,
        source,
      },
    });
    await this.client.appendToStream('my-courses-2', event);
  }

  public async courseExcluded(
    courseId: string,
    reason?: string,
  ): Promise<void> {
    const event = jsonEvent<CourseExcluded>({
      type: EventNames.CourseExcluded,
      data: {
        id: nanoid(),
        courseId,
        reason,
      },
    });
    await this.client.appendToStream('my-courses-2', event);
  }

  public async excludedCourses() {
    const courseIds = [];
    const events = this.client.readStream<CourseExcluded>('my-courses-2');

    try {
      for await (const { event } of events) {
        switch (event.type) {
          case EventNames.CourseExcluded:
            courseIds.push(event.data.courseId);
            break;
        }
      }
    } catch (err) {
      if (err.type === 'stream-not-found') {
        this.logger.log('climbs stream not found');
        return [];
      }
      throw err;
    }
    return courseIds.sort();
  }
}
