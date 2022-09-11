import { JSONEventType } from '@eventstore/db-client';
import { DiscLost } from './disc-lost';
import { DiscStatusUpdated } from './disc-status-updated';
import { DiscColorUpdated } from './disc-color-updated';
import { DiscBrandUpdated } from './disc-brand-updated';
import { DiscUpdated } from './disc-updated';

export enum EventNames {
  DiscAdded = 'disc-added',
  DiscRemoved = 'disc-removed',
  DiscLost = 'disc-lost',
  DiscsReset = 'discs-reset',
  CourseAdded = 'course-added',
  CourseMapped = 'course-mapped',
  CoursePlayed = 'course-played',
  CourseExcluded = 'course-excluded',
  PdgaSyncByStateRequested = 'pdga-sync-by-state-requested',
  PdgaCourseHeaderCreated = 'pdga-course-header-created',
  PdgaCourseCached = 'pdga-course-cached',
  AdventureCreated = 'adventure-created',
  AdventureDeleted = 'adventure-deleted',
  AdventureImportStarted = 'adventure-import-started',
  MaintenanceCreated = 'maintenance-created',
  PersonalRecordClimbingCreated = 'personal-record-climbing-created',
  DiscStatusUpdated = 'disc-status-updated',
  DiscColorUpdated = 'disc-color-updated',
  DiscBrandUpdated = 'disc-brand-updated',
  DiscUpdated = 'disc-updated',
}

export type DiscAdded = JSONEventType<
  EventNames.DiscAdded,
  {
    id: string;
    date?: Date;
    brand: string;
    model: string;
    color?: string;
  }
>;

export type DiscRemoved = JSONEventType<
  EventNames.DiscRemoved,
  {
    id: string;
    date: Date;
  }
>;

export type DiscsReset = JSONEventType<EventNames.DiscsReset>;

export type DgEvents =
  | DiscAdded
  | DiscRemoved
  | DiscsReset
  | DiscLost
  | DiscStatusUpdated
  | DiscColorUpdated
  | DiscBrandUpdated
  | DiscUpdated;
