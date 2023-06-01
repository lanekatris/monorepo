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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type Adventure = {
  __typename?: 'Adventure';
  activities: Array<AdventureActivity>;
  date: Scalars['DateTime'];
  id: Scalars['ID'];
};

export enum AdventureActivity {
  DiscGolf = 'DISC_GOLF',
  OutdoorRockClimbing = 'OUTDOOR_ROCK_CLIMBING',
  Volleyball = 'VOLLEYBALL'
}

export type CreateAdventureInput = {
  activities: Array<AdventureActivity>;
  date?: InputMaybe<Scalars['DateTime']>;
  location?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type LogFoodInput = {
  date?: InputMaybe<Scalars['DateTime']>;
  location?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  usedBlackStone?: InputMaybe<Scalars['Boolean']>;
};

export type LogMaintenanceInput = {
  date?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  target: MaintenanceTarget;
};

export enum MaintenanceTarget {
  Crv = 'CRV',
  Equinox = 'Equinox',
  Horses = 'Horses',
  Snowboard = 'Snowboard',
  Truck = 'Truck'
}

export type Movie = {
  __typename?: 'Movie';
  name: Scalars['ID'];
  watched: Scalars['Boolean'];
};

export type MovieInput = {
  movieName: Scalars['String'];
  type: MovieType;
};

export enum MovieType {
  Interested = 'Interested',
  Watched = 'Watched'
}

export type Mutation = {
  __typename?: 'Mutation';
  adventureCreate: Scalars['Boolean'];
  foodLog: Scalars['Boolean'];
  maintenanceCreate: Scalars['Boolean'];
  movie: Scalars['Boolean'];
};


export type MutationAdventureCreateArgs = {
  input: CreateAdventureInput;
};


export type MutationFoodLogArgs = {
  input: LogFoodInput;
};


export type MutationMaintenanceCreateArgs = {
  input: LogMaintenanceInput;
};


export type MutationMovieArgs = {
  input: MovieInput;
};

export type Query = {
  __typename?: 'Query';
  adventures: Array<Adventure>;
  movies: Array<Movie>;
};

export type IdkQueryVariables = Exact<{ [key: string]: never; }>;


export type IdkQuery = { __typename?: 'Query', adventures: Array<{ __typename?: 'Adventure', date: any, activities: Array<AdventureActivity> }> };

export type MoviesQueryManQueryVariables = Exact<{ [key: string]: never; }>;


export type MoviesQueryManQuery = { __typename?: 'Query', movies: Array<{ __typename?: 'Movie', name: string, watched: boolean }> };


export const IdkDocument = gql`
    query idk {
  adventures {
    date
    activities
  }
}
    `;
export const MoviesQueryManDocument = gql`
    query moviesQueryMan {
  movies {
    name
    watched
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    idk(variables?: IdkQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IdkQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IdkQuery>(IdkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'idk', 'query');
    },
    moviesQueryMan(variables?: MoviesQueryManQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MoviesQueryManQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MoviesQueryManQuery>(MoviesQueryManDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'moviesQueryMan', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;