import { Inject, Injectable, Logger } from '@nestjs/common';
import { DgEvents, EventNames } from './types/disc-added';
import { STREAM_DG_DATA_LOAD, ESDB } from '../app/utils/constants';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { CourseAdded } from './types/course-added';
import { CoursePlayed, CoursePlayedSource } from './types/course-played';
import { nanoid } from 'nanoid';
import { CourseExcluded } from './types/course-excluded';
import { getDistance } from 'geolib';
import { CourseDistanceFromHome, DiscGolfCourse } from './types/course';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';

const GeoJSON = require('geojson');

export enum DiscStatus {
  Unknown,
  InBag,
  Lost,
}
registerEnumType(DiscStatus, {
  name: 'DiscStatus',
});

// export enum DiscBrand {
//   Innova'innova',
// }
//
// export enum DiscModel {
//   Thunderbird='Thunderbird',
// }
//
// registerEnumType(DiscBrand, {
//   name: 'DiscBrand',
// });
//
// registerEnumType(DiscModel, {
//   name: 'DiscModel',
// });

@ObjectType()
export class Disc {
  @Field(() => ID)
  @Field()
  id: string;
  @Field()
  date: string;
  @Field()
  brand: string;
  @Field()
  model: string;
  @Field()
  number: number;

  @Field(() => DiscStatus)
  status: DiscStatus;

  @Field({ nullable: true })
  color?: string;
}

@Injectable()
export class DgService {
  private readonly logger = new Logger(DgService.name);
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
  ) {}

  public async getDiscs(): Promise<Disc[]> {
    const events = this.client.readStream<DgEvents>('testies');
    let discs: Disc[] = [];

    let discNumber = 1;
    for await (const { event } of events) {
      switch (event.type) {
        case EventNames.DiscStatusUpdated: {
          const disc = discs.find((x) => x.id === event.data.discId);
          if (disc) {
            disc.status = event.data.status;
          }
          break;
        }

        case EventNames.DiscAdded:
          discs.unshift({
            id: event.data.id,
            date: event.data.date.toString(),
            brand: event.data.brand,
            model: event.data.model,
            number: discNumber,
            status: DiscStatus.Unknown,
          });
          discNumber++;
          break;

        /**
         * Don't decrement disc numbers. Once you add a disc it gets a forever incremented number
         * and nobody else can take it
         */
        case EventNames.DiscRemoved:
          discs = discs.filter((x) => event.data.id !== x.id);
          break;
        case EventNames.DiscsReset:
          discs.length = 0;
          discNumber = 1;
          break;
        case EventNames.DiscLost: {
          const disc = discs.find((x) => x.id === event.data.discId);
          if (disc) {
            disc.status = DiscStatus.Lost;
          }
          break;
        }
      }
    }
    return discs;
  }

  public async getAllCourses(): Promise<DiscGolfCourse[]> {
    const courses: DiscGolfCourse[] = [];
    const playedCourses = await this.getPlayedCourses();
    const excludedCourses = await this.excludedCourses();

    const events = this.client.readStream<CourseAdded>(STREAM_DG_DATA_LOAD);
    try {
      for await (const { event } of events) {
        switch (event.type) {
          case EventNames.CourseAdded:
            const { id, latitude, longitude, name, state } = event.data;
            // if (excludedCourses.includes(id)) break;
            const distanceInMeters = getDistance(
              {
                latitude: process.env.HOME_LATITUDE,
                longitude: process.env.HOME_LONGITUDE,
              },
              { latitude, longitude },
            );
            const hasPlayed = playedCourses.includes(id);
            const excluded = excludedCourses.includes(id);
            courses.push(
              new DiscGolfCourse(
                id,
                name,
                latitude,
                longitude,
                hasPlayed,
                state,
                excluded,
                new CourseDistanceFromHome(distanceInMeters),
              ),
            );
            break;
        }
      }
    } catch (err) {
      if (err.type === 'stream-not-found') {
        this.logger.log(`${STREAM_DG_DATA_LOAD} stream not found`);
        return [];
      }
      throw err;
    }
    return courses;
  }

  public async getPlayedCourses(): Promise<string[]> {
    let courseIds = [];
    const events = this.client.readStream<CoursePlayed | CourseExcluded>(
      'my-courses-2',
    );

    try {
      for await (const { event } of events) {
        switch (event.type) {
          case EventNames.CoursePlayed:
            courseIds.push(event.data.courseId);
            break;
          case EventNames.CourseExcluded:
            courseIds = courseIds.filter((id) => id !== event.data.courseId);
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

  public getGeoJson(courses: DiscGolfCourse[]) {
    const filteredCourses = courses
      .filter(({ hasPlayed }) => !hasPlayed)
      .filter(({ excluded }) => !excluded);

    const geoJsonObject = GeoJSON.parse(
      filteredCourses.map((x) => ({
        ...x,
        icon: 'emoji-📀',
        marker_type: 'outlined-icon',
        marker_color: '#F42410',
        marker_decoration: 'emoji-📀',
      })),
      {
        Point: ['latitude', 'longitude'],
      },
    );
    return geoJsonObject;
  }
}
