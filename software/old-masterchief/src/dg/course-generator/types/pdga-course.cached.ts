import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from '../../types/disc-added';

export type PdgaCourseCached = JSONEventType<
  EventNames.PdgaCourseCached,
  {
    id: string;
    courseId: string;
  }
>;
