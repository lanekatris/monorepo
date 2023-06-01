import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  UUID: any;
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
  elevation?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  id?: InputMaybe<ComparableInt32OperationFilterInput>;
  isStatePark?: InputMaybe<ComparableInt32OperationFilterInput>;
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
  created?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableInt32OperationFilterInput>;
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

export type ComparableDateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  neq?: InputMaybe<Scalars['DateTime']>;
  ngt?: InputMaybe<Scalars['DateTime']>;
  ngte?: InputMaybe<Scalars['DateTime']>;
  nin?: InputMaybe<Array<Scalars['DateTime']>>;
  nlt?: InputMaybe<Scalars['DateTime']>;
  nlte?: InputMaybe<Scalars['DateTime']>;
};

export type ComparableInt32OperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  neq?: InputMaybe<Scalars['Int']>;
  ngt?: InputMaybe<Scalars['Int']>;
  ngte?: InputMaybe<Scalars['Int']>;
  nin?: InputMaybe<Array<Scalars['Int']>>;
  nlt?: InputMaybe<Scalars['Int']>;
  nlte?: InputMaybe<Scalars['Int']>;
};

export type ComparableNullableOfDateTimeOperationFilterInput = {
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

export type ComparableNullableOfInt32OperationFilterInput = {
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

export type ComparableNullableOfSingleOperationFilterInput = {
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
  created?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  data?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableInt32OperationFilterInput>;
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
  created?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableInt32OperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MaintenanceFilterInput>>;
  price?: InputMaybe<ComparableNullableOfSingleOperationFilterInput>;
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
  bookmarkCreate: Bookmark;
  bookmarkRead: Bookmark;
  feedItemCreate: Feed;
  sleepComputer: Scalars['Boolean'];
  vehicleDriven: Vehicle;
  vehicleNameUpdated: Vehicle;
};


export type MutationBookmarkCreateArgs = {
  tags?: InputMaybe<Array<Scalars['String']>>;
  url: Scalars['String'];
};


export type MutationBookmarkReadArgs = {
  id: Scalars['Int'];
};


export type MutationFeedItemCreateArgs = {
  input: FeedItemCreateInput;
};


export type MutationVehicleDrivenArgs = {
  input: VehicleDrivenInput;
};


export type MutationVehicleNameUpdatedArgs = {
  input: VehicleNameUpdatedInput;
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
  bookmark?: Maybe<BookmarkConnection>;
  feed: Array<Feed>;
  latestHealth: Array<TaskDto>;
  maintenance: Array<Maintenance>;
  place?: Maybe<PlaceConnection>;
  sysInfo: Scalars['String'];
  vehicles: Array<Vehicle>;
};


export type QueryBookmarkArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  order?: InputMaybe<Array<BookmarkSortInput>>;
  where?: InputMaybe<BookmarkFilterInput>;
};


export type QueryFeedArgs = {
  order?: InputMaybe<Array<FeedSortInput>>;
  where?: InputMaybe<FeedFilterInput>;
};


export type QueryMaintenanceArgs = {
  order?: InputMaybe<Array<MaintenanceSortInput>>;
  where?: InputMaybe<MaintenanceFilterInput>;
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

export type CreateFeedItemMutationVariables = Exact<{
  input: FeedItemCreateInput;
}>;


export type CreateFeedItemMutation = { __typename?: 'Mutation', feedItemCreate: { __typename?: 'Feed', created: any, data?: string | null, id: number, message?: string | null, tags: string, type: string } };

export type VehicleDrivenMutationVariables = Exact<{
  input: VehicleDrivenInput;
}>;


export type VehicleDrivenMutation = { __typename?: 'Mutation', vehicleDriven: { __typename?: 'Vehicle', id: any, lastDriven: any } };

export type VehiclesQueryVariables = Exact<{ [key: string]: never; }>;


export type VehiclesQuery = { __typename?: 'Query', vehicles: Array<{ __typename?: 'Vehicle', id: any, lastDriven: any, name: string, userId: any }> };

export type VehicleNameUpdatedMutationVariables = Exact<{
  input: VehicleNameUpdatedInput;
}>;


export type VehicleNameUpdatedMutation = { __typename?: 'Mutation', vehicleNameUpdated: { __typename?: 'Vehicle', id: any, name: string } };

export type SleepComputerMutationVariables = Exact<{ [key: string]: never; }>;


export type SleepComputerMutation = { __typename?: 'Mutation', sleepComputer: boolean };


export const CreateFeedItemDocument = gql`
    mutation createFeedItem($input: FeedItemCreateInput!) {
  feedItemCreate(input: $input) {
    created
    data
    id
    message
    tags
    type
  }
}
    `;
export const VehicleDrivenDocument = gql`
    mutation vehicleDriven($input: VehicleDrivenInput!) {
  vehicleDriven(input: $input) {
    id
    lastDriven
  }
}
    `;
export const VehiclesDocument = gql`
    query vehicles {
  vehicles {
    id
    lastDriven
    name
    userId
  }
}
    `;
export const VehicleNameUpdatedDocument = gql`
    mutation vehicleNameUpdated($input: VehicleNameUpdatedInput!) {
  vehicleNameUpdated(input: $input) {
    id
    name
  }
}
    `;
export const SleepComputerDocument = gql`
    mutation sleepComputer {
  sleepComputer
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    createFeedItem(variables: CreateFeedItemMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateFeedItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateFeedItemMutation>(CreateFeedItemDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createFeedItem', 'mutation');
    },
    vehicleDriven(variables: VehicleDrivenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<VehicleDrivenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<VehicleDrivenMutation>(VehicleDrivenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'vehicleDriven', 'mutation');
    },
    vehicles(variables?: VehiclesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<VehiclesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<VehiclesQuery>(VehiclesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'vehicles', 'query');
    },
    vehicleNameUpdated(variables: VehicleNameUpdatedMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<VehicleNameUpdatedMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<VehicleNameUpdatedMutation>(VehicleNameUpdatedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'vehicleNameUpdated', 'mutation');
    },
    sleepComputer(variables?: SleepComputerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SleepComputerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SleepComputerMutation>(SleepComputerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sleepComputer', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;