import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  Decimal: any;
  UUID: any;
};

export type ActivityLog = {
  __typename?: 'ActivityLog';
  date: Scalars['DateTime'];
  goal: Goal;
  id: Scalars['UUID'];
};

export type ActivityLogCreatedInput = {
  activityLogId: Scalars['UUID'];
  date: Scalars['DateTime'];
  goalId: Scalars['UUID'];
  userId: Scalars['UUID'];
};

export type ActivityLogFilterInput = {
  and?: InputMaybe<Array<ActivityLogFilterInput>>;
  date?: InputMaybe<DateTimeOperationFilterInput>;
  goalId?: InputMaybe<UuidOperationFilterInput>;
  id?: InputMaybe<UuidOperationFilterInput>;
  or?: InputMaybe<Array<ActivityLogFilterInput>>;
};

export type ActivityLogSortInput = {
  date?: InputMaybe<SortEnumType>;
  goalId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
};

export type AttributedPlace = {
  __typename?: 'AttributedPlace';
  city?: Maybe<Scalars['String']>;
  elevation?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  isStatePark: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  visited?: Maybe<Scalars['Boolean']>;
  zip?: Maybe<Scalars['String']>;
};

export type AttributedPlaceFilterInput = {
  and?: InputMaybe<Array<AttributedPlaceFilterInput>>;
  city?: InputMaybe<StringOperationFilterInput>;
  elevation?: InputMaybe<IntOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isStatePark?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AttributedPlaceFilterInput>>;
  state?: InputMaybe<StringOperationFilterInput>;
  tags?: InputMaybe<StringOperationFilterInput>;
  visited?: InputMaybe<BooleanOperationFilterInput>;
  zip?: InputMaybe<StringOperationFilterInput>;
};

export type AttributedPlaceSortInput = {
  city?: InputMaybe<SortEnumType>;
  elevation?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isStatePark?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  state?: InputMaybe<SortEnumType>;
  tags?: InputMaybe<SortEnumType>;
  visited?: InputMaybe<SortEnumType>;
  zip?: InputMaybe<SortEnumType>;
};

export type Bookmark = {
  __typename?: 'Bookmark';
  created: Scalars['DateTime'];
  id: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  meta?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

/** A connection to a list of items. */
export type BookmarkConnection = {
  __typename?: 'BookmarkConnection';
  /** A list of edges. */
  edges?: Maybe<Array<BookmarkEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Bookmark>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type BookmarkEdge = {
  __typename?: 'BookmarkEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Bookmark;
};

export type BookmarkFilterInput = {
  and?: InputMaybe<Array<BookmarkFilterInput>>;
  created?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  imageUrl?: InputMaybe<StringOperationFilterInput>;
  meta?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<BookmarkFilterInput>>;
  status?: InputMaybe<StringOperationFilterInput>;
  tags?: InputMaybe<StringOperationFilterInput>;
  url?: InputMaybe<StringOperationFilterInput>;
};

export type BookmarkSortInput = {
  created?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  imageUrl?: InputMaybe<SortEnumType>;
  meta?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  tags?: InputMaybe<SortEnumType>;
  url?: InputMaybe<SortEnumType>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  neq?: InputMaybe<Scalars['Boolean']>;
};

export type DateOperationFilterInput = {
  eq?: InputMaybe<Scalars['Date']>;
  gt?: InputMaybe<Scalars['Date']>;
  gte?: InputMaybe<Scalars['Date']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  lt?: InputMaybe<Scalars['Date']>;
  lte?: InputMaybe<Scalars['Date']>;
  neq?: InputMaybe<Scalars['Date']>;
  ngt?: InputMaybe<Scalars['Date']>;
  ngte?: InputMaybe<Scalars['Date']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  nlt?: InputMaybe<Scalars['Date']>;
  nlte?: InputMaybe<Scalars['Date']>;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  neq?: InputMaybe<Scalars['DateTime']>;
  ngt?: InputMaybe<Scalars['DateTime']>;
  ngte?: InputMaybe<Scalars['DateTime']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  nlt?: InputMaybe<Scalars['DateTime']>;
  nlte?: InputMaybe<Scalars['DateTime']>;
};

export type DecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']>;
  gt?: InputMaybe<Scalars['Decimal']>;
  gte?: InputMaybe<Scalars['Decimal']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Decimal']>>>;
  lt?: InputMaybe<Scalars['Decimal']>;
  lte?: InputMaybe<Scalars['Decimal']>;
  neq?: InputMaybe<Scalars['Decimal']>;
  ngt?: InputMaybe<Scalars['Decimal']>;
  ngte?: InputMaybe<Scalars['Decimal']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Decimal']>>>;
  nlt?: InputMaybe<Scalars['Decimal']>;
  nlte?: InputMaybe<Scalars['Decimal']>;
};

export type Disc = {
  __typename?: 'Disc';
  brand?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  created: Scalars['DateTime'];
  id: Scalars['Int'];
  model?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Decimal']>;
  realCreatedDate?: Maybe<Scalars['Date']>;
  status?: Maybe<Scalars['String']>;
  tags: Scalars['String'];
  type: Scalars['String'];
  weight?: Maybe<Scalars['Int']>;
};

export type DiscCreatedInput = {
  brand?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  created?: InputMaybe<Scalars['String']>;
  discId?: InputMaybe<Scalars['UUID']>;
  model?: InputMaybe<Scalars['String']>;
  number: Scalars['Int'];
  price?: InputMaybe<Scalars['Decimal']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  type: DiscDtoType;
  userId: Scalars['UUID'];
  weight?: InputMaybe<Scalars['Int']>;
};

export type DiscDeletedInput = {
  discId: Scalars['UUID'];
  userId: Scalars['UUID'];
};

export type DiscDto = {
  __typename?: 'DiscDto';
  brand?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['DateTime']>;
  discType: DiscDtoType;
  history: Array<Scalars['String']>;
  id: Scalars['UUID'];
  model?: Maybe<Scalars['String']>;
  number: Scalars['Int'];
  price?: Maybe<Scalars['Decimal']>;
  tags?: Maybe<Array<Scalars['String']>>;
  updated?: Maybe<Scalars['DateTime']>;
  userId: Scalars['UUID'];
  weight?: Maybe<Scalars['Int']>;
};

export enum DiscDtoType {
  Disc = 'DISC',
  Mini = 'MINI'
}

export type DiscFilterInput = {
  and?: InputMaybe<Array<DiscFilterInput>>;
  brand?: InputMaybe<StringOperationFilterInput>;
  color?: InputMaybe<StringOperationFilterInput>;
  created?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  model?: InputMaybe<StringOperationFilterInput>;
  number?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<DiscFilterInput>>;
  price?: InputMaybe<DecimalOperationFilterInput>;
  realCreatedDate?: InputMaybe<DateOperationFilterInput>;
  status?: InputMaybe<StringOperationFilterInput>;
  tags?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<StringOperationFilterInput>;
  weight?: InputMaybe<IntOperationFilterInput>;
};

export type DiscSortInput = {
  brand?: InputMaybe<SortEnumType>;
  color?: InputMaybe<SortEnumType>;
  created?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  model?: InputMaybe<SortEnumType>;
  number?: InputMaybe<SortEnumType>;
  price?: InputMaybe<SortEnumType>;
  realCreatedDate?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  tags?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  weight?: InputMaybe<SortEnumType>;
};

export type DiscUpdatedInput = {
  brand?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  discId: Scalars['UUID'];
  model?: InputMaybe<Scalars['String']>;
  number?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['Decimal']>;
  tags?: InputMaybe<Array<Scalars['String']>>;
  type?: InputMaybe<DiscDtoType>;
  userId: Scalars['UUID'];
  weight?: InputMaybe<Scalars['Int']>;
};

export type Feed = {
  __typename?: 'Feed';
  created: Scalars['DateTime'];
  data?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  message?: Maybe<Scalars['String']>;
  tags: Scalars['String'];
  type: Scalars['String'];
};

export type FeedFilterInput = {
  and?: InputMaybe<Array<FeedFilterInput>>;
  created?: InputMaybe<DateTimeOperationFilterInput>;
  data?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  message?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<FeedFilterInput>>;
  tags?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<StringOperationFilterInput>;
};

export type FeedItemCreateInput = {
  data?: InputMaybe<Scalars['String']>;
  message?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
};

export type FeedSortInput = {
  created?: InputMaybe<SortEnumType>;
  data?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  message?: InputMaybe<SortEnumType>;
  tags?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
};

export type FloatOperationFilterInput = {
  eq?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  neq?: InputMaybe<Scalars['Float']>;
  ngt?: InputMaybe<Scalars['Float']>;
  ngte?: InputMaybe<Scalars['Float']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  nlt?: InputMaybe<Scalars['Float']>;
  nlte?: InputMaybe<Scalars['Float']>;
};

export type GetDiscsInput = {
  includeDeleted?: InputMaybe<Scalars['Boolean']>;
};

export type GetGoalLogInput = {
  end?: InputMaybe<Scalars['DateTime']>;
  start?: InputMaybe<Scalars['DateTime']>;
};

export type GetGoalLogsResult = {
  __typename?: 'GetGoalLogsResult';
  entries: Array<GoalLogEntry>;
  totalWeeksCompleted: Scalars['Int'];
  totalWeeksUncompleted: Scalars['Int'];
};

export type Goal = {
  __typename?: 'Goal';
  created: Scalars['DateTime'];
  frequency: GoalFrequency;
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  tags: Array<Scalars['String']>;
  targetCount: Scalars['Int'];
  type: GoalType;
};

export type GoalCreatedInput = {
  date: Scalars['DateTime'];
  goalId: Scalars['UUID'];
  name?: InputMaybe<Scalars['String']>;
};

export enum GoalFrequency {
  Daily = 'DAILY',
  Weekly = 'WEEKLY'
}

export type GoalLogEntry = {
  __typename?: 'GoalLogEntry';
  completed: Scalars['Boolean'];
  completedGoalCount: Scalars['Int'];
  goalCount: Scalars['Int'];
  isThisWeek: Scalars['Boolean'];
  uncompleteGoalCount: Scalars['Int'];
  weekName: Scalars['String'];
};

export enum GoalType {
  Fitness = 'FITNESS'
}

export type GoalUpdatedInput = {
  date: Scalars['DateTime'];
  frequency?: InputMaybe<GoalFrequency>;
  goalId: Scalars['UUID'];
  targetCount?: InputMaybe<Scalars['Int']>;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  neq?: InputMaybe<Scalars['Int']>;
  ngt?: InputMaybe<Scalars['Int']>;
  ngte?: InputMaybe<Scalars['Int']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  nlt?: InputMaybe<Scalars['Int']>;
  nlte?: InputMaybe<Scalars['Int']>;
};

export type Maintenance = {
  __typename?: 'Maintenance';
  created?: Maybe<Scalars['DateTime']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  price?: Maybe<Scalars['Float']>;
  property: Scalars['String'];
};

export type MaintenanceFilterInput = {
  and?: InputMaybe<Array<MaintenanceFilterInput>>;
  created?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MaintenanceFilterInput>>;
  price?: InputMaybe<FloatOperationFilterInput>;
  property?: InputMaybe<StringOperationFilterInput>;
};

export type MaintenanceSortInput = {
  created?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  price?: InputMaybe<SortEnumType>;
  property?: InputMaybe<SortEnumType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  activityLogCreate: ActivityLog;
  activityLogsCreate: Array<ActivityLog>;
  bookmarkCreate: Bookmark;
  bookmarkRead: Bookmark;
  deleteAllDiscs: Scalars['Boolean'];
  discCreate: DiscDto;
  discDelete: DiscDto;
  discUpdate: DiscDto;
  feedItemCreate: Feed;
  goalCreate: Goal;
  goalUpdate: Goal;
  indexesRebuild: Scalars['Boolean'];
  migrateDiscs: Scalars['Boolean'];
  sleepComputer: Scalars['Boolean'];
  vehicleDriven: Vehicle;
  vehicleNameUpdated: Vehicle;
};


export type MutationActivityLogCreateArgs = {
  input: ActivityLogCreatedInput;
};


export type MutationActivityLogsCreateArgs = {
  input: Array<ActivityLogCreatedInput>;
};


export type MutationBookmarkCreateArgs = {
  tags?: InputMaybe<Array<Scalars['String']>>;
  url: Scalars['String'];
};


export type MutationBookmarkReadArgs = {
  id: Scalars['Int'];
};


export type MutationDiscCreateArgs = {
  input: DiscCreatedInput;
};


export type MutationDiscDeleteArgs = {
  input: DiscDeletedInput;
};


export type MutationDiscUpdateArgs = {
  input: DiscUpdatedInput;
};


export type MutationFeedItemCreateArgs = {
  input: FeedItemCreateInput;
};


export type MutationGoalCreateArgs = {
  input: GoalCreatedInput;
};


export type MutationGoalUpdateArgs = {
  input: GoalUpdatedInput;
};


export type MutationVehicleDrivenArgs = {
  input: VehicleDrivenInput;
};


export type MutationVehicleNameUpdatedArgs = {
  input: VehicleNameUpdatedInput;
};

/** A connection to a list of items. */
export type OldDiscsConnection = {
  __typename?: 'OldDiscsConnection';
  /** A list of edges. */
  edges?: Maybe<Array<OldDiscsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Disc>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type OldDiscsEdge = {
  __typename?: 'OldDiscsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: Disc;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/** A connection to a list of items. */
export type PlaceConnection = {
  __typename?: 'PlaceConnection';
  /** A list of edges. */
  edges?: Maybe<Array<PlaceEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<AttributedPlace>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type PlaceEdge = {
  __typename?: 'PlaceEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node: AttributedPlace;
};

export type Query = {
  __typename?: 'Query';
  activityLogs: Array<ActivityLog>;
  bookmark?: Maybe<BookmarkConnection>;
  disc?: Maybe<DiscDto>;
  discs: Array<DiscDto>;
  feed: Array<Feed>;
  goalLog: GetGoalLogsResult;
  goals: Array<Goal>;
  latestHealth: Array<TaskDto>;
  maintenance: Array<Maintenance>;
  oldDiscs?: Maybe<OldDiscsConnection>;
  place?: Maybe<PlaceConnection>;
  sysInfo: Scalars['String'];
  vehicles: Array<Vehicle>;
};


export type QueryActivityLogsArgs = {
  order?: InputMaybe<Array<ActivityLogSortInput>>;
  where?: InputMaybe<ActivityLogFilterInput>;
};


export type QueryBookmarkArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Array<BookmarkSortInput>>;
  where?: InputMaybe<BookmarkFilterInput>;
};


export type QueryDiscArgs = {
  discId: Scalars['UUID'];
};


export type QueryDiscsArgs = {
  input?: InputMaybe<GetDiscsInput>;
};


export type QueryFeedArgs = {
  order?: InputMaybe<Array<FeedSortInput>>;
  where?: InputMaybe<FeedFilterInput>;
};


export type QueryGoalLogArgs = {
  input?: InputMaybe<GetGoalLogInput>;
};


export type QueryMaintenanceArgs = {
  order?: InputMaybe<Array<MaintenanceSortInput>>;
  where?: InputMaybe<MaintenanceFilterInput>;
};


export type QueryOldDiscsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Array<DiscSortInput>>;
  where?: InputMaybe<DiscFilterInput>;
};


export type QueryPlaceArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Array<AttributedPlaceSortInput>>;
  where?: InputMaybe<AttributedPlaceFilterInput>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ncontains?: InputMaybe<Scalars['String']>;
  nendsWith?: InputMaybe<Scalars['String']>;
  neq?: InputMaybe<Scalars['String']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  nstartsWith?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type TaskDto = {
  __typename?: 'TaskDto';
  done: Scalars['Boolean'];
  task: Scalars['String'];
};

export type UuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']>;
  gt?: InputMaybe<Scalars['UUID']>;
  gte?: InputMaybe<Scalars['UUID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  lt?: InputMaybe<Scalars['UUID']>;
  lte?: InputMaybe<Scalars['UUID']>;
  neq?: InputMaybe<Scalars['UUID']>;
  ngt?: InputMaybe<Scalars['UUID']>;
  ngte?: InputMaybe<Scalars['UUID']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  nlt?: InputMaybe<Scalars['UUID']>;
  nlte?: InputMaybe<Scalars['UUID']>;
};

export type Vehicle = {
  __typename?: 'Vehicle';
  id: Scalars['UUID'];
  lastDriven: Scalars['DateTime'];
  name: Scalars['String'];
  userId: Scalars['UUID'];
};

export type VehicleDrivenInput = {
  date: Scalars['DateTime'];
  userId: Scalars['UUID'];
  vehicleId: Scalars['UUID'];
};

export type VehicleNameUpdatedInput = {
  date: Scalars['DateTime'];
  name: Scalars['String'];
  userId: Scalars['UUID'];
  vehicleId: Scalars['UUID'];
};

export type CreateDiscMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateDiscMutation = { __typename?: 'Mutation', discCreate: { __typename: 'DiscDto', id: any, userId: any, created?: string | null, updated?: any | null, deleted?: any | null, weight?: number | null, discType: DiscDtoType, price?: any | null, tags?: Array<string> | null, color?: string | null, number: number, model?: string | null, brand?: string | null, history: Array<string> } };

export type DeleteDiscMutationVariables = Exact<{
  discId: Scalars['UUID'];
}>;


export type DeleteDiscMutation = { __typename?: 'Mutation', discDelete: { __typename: 'DiscDto', id: any, userId: any, created?: string | null, updated?: any | null, deleted?: any | null, weight?: number | null, discType: DiscDtoType, price?: any | null, tags?: Array<string> | null, color?: string | null, number: number, model?: string | null, brand?: string | null, history: Array<string> } };

export type GetDiscsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDiscsQuery = { __typename?: 'Query', discs: Array<{ __typename: 'DiscDto', id: any, userId: any, created?: string | null, updated?: any | null, deleted?: any | null, weight?: number | null, discType: DiscDtoType, price?: any | null, tags?: Array<string> | null, color?: string | null, number: number, model?: string | null, brand?: string | null, history: Array<string> }> };

export type DiscPropsFragment = { __typename: 'DiscDto', id: any, userId: any, created?: string | null, updated?: any | null, deleted?: any | null, weight?: number | null, discType: DiscDtoType, price?: any | null, tags?: Array<string> | null, color?: string | null, number: number, model?: string | null, brand?: string | null, history: Array<string> };

export type GetDiscQueryVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type GetDiscQuery = { __typename?: 'Query', disc?: { __typename: 'DiscDto', id: any, userId: any, created?: string | null, updated?: any | null, deleted?: any | null, weight?: number | null, discType: DiscDtoType, price?: any | null, tags?: Array<string> | null, color?: string | null, number: number, model?: string | null, brand?: string | null, history: Array<string> } | null };

export type UpdateDiscMutationVariables = Exact<{
  input: DiscUpdatedInput;
}>;


export type UpdateDiscMutation = { __typename?: 'Mutation', discUpdate: { __typename: 'DiscDto', id: any, userId: any, created?: string | null, updated?: any | null, deleted?: any | null, weight?: number | null, discType: DiscDtoType, price?: any | null, tags?: Array<string> | null, color?: string | null, number: number, model?: string | null, brand?: string | null, history: Array<string> } };

export type GetGoalLogQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGoalLogQuery = { __typename?: 'Query', goalLog: { __typename?: 'GetGoalLogsResult', totalWeeksCompleted: number, totalWeeksUncompleted: number, entries: Array<{ __typename?: 'GoalLogEntry', weekName: string, completed: boolean, completedGoalCount: number, uncompleteGoalCount: number, goalCount: number, isThisWeek: boolean }> } };

export type GetGoalsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGoalsQuery = { __typename?: 'Query', goals: Array<{ __typename?: 'Goal', id: any, created: any, type: GoalType, frequency: GoalFrequency, targetCount: number, tags: Array<string>, name?: string | null }> };

export type GoalFragmentFragment = { __typename?: 'Goal', id: any, created: any, type: GoalType, frequency: GoalFrequency, targetCount: number, tags: Array<string>, name?: string | null };

export type CreateFitnessActivityMutationVariables = Exact<{
  input: ActivityLogCreatedInput;
}>;


export type CreateFitnessActivityMutation = { __typename?: 'Mutation', activityLogCreate: { __typename?: 'ActivityLog', id: any } };

export type CreateFitnessActivitiesMutationVariables = Exact<{
  input: Array<ActivityLogCreatedInput> | ActivityLogCreatedInput;
}>;


export type CreateFitnessActivitiesMutation = { __typename?: 'Mutation', activityLogsCreate: Array<{ __typename?: 'ActivityLog', id: any }> };

export type GetFitnessActivityActivityLogsQueryVariables = Exact<{
  input?: InputMaybe<ActivityLogFilterInput>;
}>;


export type GetFitnessActivityActivityLogsQuery = { __typename?: 'Query', activityLogs: Array<{ __typename?: 'ActivityLog', id: any, date: any }> };

export const DiscPropsFragmentDoc = gql`
    fragment discProps on DiscDto {
  id
  userId
  created
  updated
  deleted
  weight
  discType
  price
  tags
  color
  number
  model
  brand
  history
  __typename
}
    `;
export const GoalFragmentFragmentDoc = gql`
    fragment goalFragment on Goal {
  id
  created
  type
  frequency
  targetCount
  tags
  name
}
    `;
export const CreateDiscDocument = gql`
    mutation createDisc {
  discCreate(
    input: {number: -1, type: DISC, userId: "a80cf46b-c842-4b75-8f4a-38e4699301c0"}
  ) {
    ...discProps
  }
}
    ${DiscPropsFragmentDoc}`;
export type CreateDiscMutationFn = Apollo.MutationFunction<CreateDiscMutation, CreateDiscMutationVariables>;

/**
 * __useCreateDiscMutation__
 *
 * To run a mutation, you first call `useCreateDiscMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDiscMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDiscMutation, { data, loading, error }] = useCreateDiscMutation({
 *   variables: {
 *   },
 * });
 */
export function useCreateDiscMutation(baseOptions?: Apollo.MutationHookOptions<CreateDiscMutation, CreateDiscMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDiscMutation, CreateDiscMutationVariables>(CreateDiscDocument, options);
      }
export type CreateDiscMutationHookResult = ReturnType<typeof useCreateDiscMutation>;
export type CreateDiscMutationResult = Apollo.MutationResult<CreateDiscMutation>;
export type CreateDiscMutationOptions = Apollo.BaseMutationOptions<CreateDiscMutation, CreateDiscMutationVariables>;
export const DeleteDiscDocument = gql`
    mutation deleteDisc($discId: UUID!) {
  discDelete(
    input: {discId: $discId, userId: "a80cf46b-c842-4b75-8f4a-38e4699301c0"}
  ) {
    ...discProps
  }
}
    ${DiscPropsFragmentDoc}`;
export type DeleteDiscMutationFn = Apollo.MutationFunction<DeleteDiscMutation, DeleteDiscMutationVariables>;

/**
 * __useDeleteDiscMutation__
 *
 * To run a mutation, you first call `useDeleteDiscMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDiscMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDiscMutation, { data, loading, error }] = useDeleteDiscMutation({
 *   variables: {
 *      discId: // value for 'discId'
 *   },
 * });
 */
export function useDeleteDiscMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDiscMutation, DeleteDiscMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDiscMutation, DeleteDiscMutationVariables>(DeleteDiscDocument, options);
      }
export type DeleteDiscMutationHookResult = ReturnType<typeof useDeleteDiscMutation>;
export type DeleteDiscMutationResult = Apollo.MutationResult<DeleteDiscMutation>;
export type DeleteDiscMutationOptions = Apollo.BaseMutationOptions<DeleteDiscMutation, DeleteDiscMutationVariables>;
export const GetDiscsDocument = gql`
    query getDiscs {
  discs {
    ...discProps
  }
}
    ${DiscPropsFragmentDoc}`;

/**
 * __useGetDiscsQuery__
 *
 * To run a query within a React component, call `useGetDiscsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDiscsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDiscsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDiscsQuery(baseOptions?: Apollo.QueryHookOptions<GetDiscsQuery, GetDiscsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDiscsQuery, GetDiscsQueryVariables>(GetDiscsDocument, options);
      }
export function useGetDiscsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDiscsQuery, GetDiscsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDiscsQuery, GetDiscsQueryVariables>(GetDiscsDocument, options);
        }
export type GetDiscsQueryHookResult = ReturnType<typeof useGetDiscsQuery>;
export type GetDiscsLazyQueryHookResult = ReturnType<typeof useGetDiscsLazyQuery>;
export type GetDiscsQueryResult = Apollo.QueryResult<GetDiscsQuery, GetDiscsQueryVariables>;
export const GetDiscDocument = gql`
    query getDisc($id: UUID!) {
  disc(discId: $id) {
    ...discProps
  }
}
    ${DiscPropsFragmentDoc}`;

/**
 * __useGetDiscQuery__
 *
 * To run a query within a React component, call `useGetDiscQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDiscQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDiscQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetDiscQuery(baseOptions: Apollo.QueryHookOptions<GetDiscQuery, GetDiscQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDiscQuery, GetDiscQueryVariables>(GetDiscDocument, options);
      }
export function useGetDiscLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDiscQuery, GetDiscQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDiscQuery, GetDiscQueryVariables>(GetDiscDocument, options);
        }
export type GetDiscQueryHookResult = ReturnType<typeof useGetDiscQuery>;
export type GetDiscLazyQueryHookResult = ReturnType<typeof useGetDiscLazyQuery>;
export type GetDiscQueryResult = Apollo.QueryResult<GetDiscQuery, GetDiscQueryVariables>;
export const UpdateDiscDocument = gql`
    mutation updateDisc($input: DiscUpdatedInput!) {
  discUpdate(input: $input) {
    ...discProps
  }
}
    ${DiscPropsFragmentDoc}`;
export type UpdateDiscMutationFn = Apollo.MutationFunction<UpdateDiscMutation, UpdateDiscMutationVariables>;

/**
 * __useUpdateDiscMutation__
 *
 * To run a mutation, you first call `useUpdateDiscMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDiscMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDiscMutation, { data, loading, error }] = useUpdateDiscMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDiscMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDiscMutation, UpdateDiscMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDiscMutation, UpdateDiscMutationVariables>(UpdateDiscDocument, options);
      }
export type UpdateDiscMutationHookResult = ReturnType<typeof useUpdateDiscMutation>;
export type UpdateDiscMutationResult = Apollo.MutationResult<UpdateDiscMutation>;
export type UpdateDiscMutationOptions = Apollo.BaseMutationOptions<UpdateDiscMutation, UpdateDiscMutationVariables>;
export const GetGoalLogDocument = gql`
    query getGoalLog {
  goalLog(input: {start: "2023-01-22T03:00:00Z"}) {
    entries {
      weekName
      completed
      completedGoalCount
      uncompleteGoalCount
      goalCount
      isThisWeek
    }
    totalWeeksCompleted
    totalWeeksUncompleted
  }
}
    `;

/**
 * __useGetGoalLogQuery__
 *
 * To run a query within a React component, call `useGetGoalLogQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoalLogQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoalLogQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGoalLogQuery(baseOptions?: Apollo.QueryHookOptions<GetGoalLogQuery, GetGoalLogQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoalLogQuery, GetGoalLogQueryVariables>(GetGoalLogDocument, options);
      }
export function useGetGoalLogLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoalLogQuery, GetGoalLogQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoalLogQuery, GetGoalLogQueryVariables>(GetGoalLogDocument, options);
        }
export type GetGoalLogQueryHookResult = ReturnType<typeof useGetGoalLogQuery>;
export type GetGoalLogLazyQueryHookResult = ReturnType<typeof useGetGoalLogLazyQuery>;
export type GetGoalLogQueryResult = Apollo.QueryResult<GetGoalLogQuery, GetGoalLogQueryVariables>;
export const GetGoalsDocument = gql`
    query getGoals {
  goals {
    ...goalFragment
  }
}
    ${GoalFragmentFragmentDoc}`;

/**
 * __useGetGoalsQuery__
 *
 * To run a query within a React component, call `useGetGoalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoalsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGoalsQuery(baseOptions?: Apollo.QueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoalsQuery, GetGoalsQueryVariables>(GetGoalsDocument, options);
      }
export function useGetGoalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoalsQuery, GetGoalsQueryVariables>(GetGoalsDocument, options);
        }
export type GetGoalsQueryHookResult = ReturnType<typeof useGetGoalsQuery>;
export type GetGoalsLazyQueryHookResult = ReturnType<typeof useGetGoalsLazyQuery>;
export type GetGoalsQueryResult = Apollo.QueryResult<GetGoalsQuery, GetGoalsQueryVariables>;
export const CreateFitnessActivityDocument = gql`
    mutation createFitnessActivity($input: ActivityLogCreatedInput!) {
  activityLogCreate(input: $input) {
    id
  }
}
    `;
export type CreateFitnessActivityMutationFn = Apollo.MutationFunction<CreateFitnessActivityMutation, CreateFitnessActivityMutationVariables>;

/**
 * __useCreateFitnessActivityMutation__
 *
 * To run a mutation, you first call `useCreateFitnessActivityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFitnessActivityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFitnessActivityMutation, { data, loading, error }] = useCreateFitnessActivityMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFitnessActivityMutation(baseOptions?: Apollo.MutationHookOptions<CreateFitnessActivityMutation, CreateFitnessActivityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFitnessActivityMutation, CreateFitnessActivityMutationVariables>(CreateFitnessActivityDocument, options);
      }
export type CreateFitnessActivityMutationHookResult = ReturnType<typeof useCreateFitnessActivityMutation>;
export type CreateFitnessActivityMutationResult = Apollo.MutationResult<CreateFitnessActivityMutation>;
export type CreateFitnessActivityMutationOptions = Apollo.BaseMutationOptions<CreateFitnessActivityMutation, CreateFitnessActivityMutationVariables>;
export const CreateFitnessActivitiesDocument = gql`
    mutation createFitnessActivities($input: [ActivityLogCreatedInput!]!) {
  activityLogsCreate(input: $input) {
    id
  }
}
    `;
export type CreateFitnessActivitiesMutationFn = Apollo.MutationFunction<CreateFitnessActivitiesMutation, CreateFitnessActivitiesMutationVariables>;

/**
 * __useCreateFitnessActivitiesMutation__
 *
 * To run a mutation, you first call `useCreateFitnessActivitiesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFitnessActivitiesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFitnessActivitiesMutation, { data, loading, error }] = useCreateFitnessActivitiesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFitnessActivitiesMutation(baseOptions?: Apollo.MutationHookOptions<CreateFitnessActivitiesMutation, CreateFitnessActivitiesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFitnessActivitiesMutation, CreateFitnessActivitiesMutationVariables>(CreateFitnessActivitiesDocument, options);
      }
export type CreateFitnessActivitiesMutationHookResult = ReturnType<typeof useCreateFitnessActivitiesMutation>;
export type CreateFitnessActivitiesMutationResult = Apollo.MutationResult<CreateFitnessActivitiesMutation>;
export type CreateFitnessActivitiesMutationOptions = Apollo.BaseMutationOptions<CreateFitnessActivitiesMutation, CreateFitnessActivitiesMutationVariables>;
export const GetFitnessActivityActivityLogsDocument = gql`
    query getFitnessActivityActivityLogs($input: ActivityLogFilterInput) {
  activityLogs(where: $input) {
    id
    date
  }
}
    `;

/**
 * __useGetFitnessActivityActivityLogsQuery__
 *
 * To run a query within a React component, call `useGetFitnessActivityActivityLogsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFitnessActivityActivityLogsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFitnessActivityActivityLogsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetFitnessActivityActivityLogsQuery(baseOptions?: Apollo.QueryHookOptions<GetFitnessActivityActivityLogsQuery, GetFitnessActivityActivityLogsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFitnessActivityActivityLogsQuery, GetFitnessActivityActivityLogsQueryVariables>(GetFitnessActivityActivityLogsDocument, options);
      }
export function useGetFitnessActivityActivityLogsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFitnessActivityActivityLogsQuery, GetFitnessActivityActivityLogsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFitnessActivityActivityLogsQuery, GetFitnessActivityActivityLogsQueryVariables>(GetFitnessActivityActivityLogsDocument, options);
        }
export type GetFitnessActivityActivityLogsQueryHookResult = ReturnType<typeof useGetFitnessActivityActivityLogsQuery>;
export type GetFitnessActivityActivityLogsLazyQueryHookResult = ReturnType<typeof useGetFitnessActivityActivityLogsLazyQuery>;
export type GetFitnessActivityActivityLogsQueryResult = Apollo.QueryResult<GetFitnessActivityActivityLogsQuery, GetFitnessActivityActivityLogsQueryVariables>;