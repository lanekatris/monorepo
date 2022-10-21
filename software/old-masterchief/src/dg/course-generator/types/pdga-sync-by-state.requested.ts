import { JSONEventType } from '@eventstore/db-client';
import { EventNames } from '../../types/disc-added';
import { StateAbbreviations } from '../../stateAbbreviations';

export type PdgaSyncByStateRequested = JSONEventType<
  EventNames.PdgaSyncByStateRequested,
  {
    id: string;
    state: StateAbbreviations;
  }
>;
