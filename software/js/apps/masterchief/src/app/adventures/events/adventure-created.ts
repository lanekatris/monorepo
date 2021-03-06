import { JSONEventType } from '@eventstore/db-client';
import { AdventureActivity, LogMaintenanceInput } from '../models/adventure';

export type AdventureCreated = JSONEventType<
  'AdventureCreated',
  {
    id: string;
    name?: string;
    location?: string;
    date: Date;
    activities: AdventureActivity[];
  }
>;

export type FoodLogged = JSONEventType<
  'FoodLogged',
  {
    id: string;
    date: Date;
    name: string;
    location?: string;
    usedBlackStone?: boolean;
  }
>;

export enum MaintenanceTarget {
  Horses = 'horses',
  Snowboard = 'snowboard',
  Truck = 'truck',
  Equinox = 'equinox',
  CRV = 'crv',
}

export type MaintenanceLogged = JSONEventType<
  'MaintenanceLogged',
  {
    id: string;
    date: Date;
    target: MaintenanceTarget;
    name: string;
  }
>;

export type MovieInterest = JSONEventType<
  'Movie_Interest',
  {
    date: Date;
    name: string;
  }
>;

export type MovieWatched = JSONEventType<
  'Movie_Watched',
  {
    date: Date;
    name: string;
  }
>;

export type MovieEvents = MovieInterest | MovieWatched;
