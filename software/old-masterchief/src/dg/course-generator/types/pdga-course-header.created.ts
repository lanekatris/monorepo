import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from '../../types/disc-added';
import { CourseHeader } from '../dto/courseHeader';

export type PdgaCourseHeaderCreated = JSONEventType<
  EventNames.PdgaCourseHeaderCreated,
  {
    id: string;
    courseHeader: CourseHeader;
  }
>;
