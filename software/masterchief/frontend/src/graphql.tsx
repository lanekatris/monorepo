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
};

export type Disc = {
  __typename?: 'Disc';
  brand: Scalars['String'];
  color?: Maybe<Scalars['String']>;
  date: Scalars['String'];
  id: Scalars['String'];
  model: Scalars['String'];
  number: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  discs: Array<Disc>;
};

export type DiscsQueryVariables = Exact<{ [key: string]: never; }>;


export type DiscsQuery = { __typename?: 'Query', discs: Array<{ __typename?: 'Disc', id: string, brand: string, model: string, number: number, color?: string | null }> };


export const DiscsDocument = gql`
    query discs {
  discs {
    id
    brand
    model
    number
    color
  }
}
    `;

/**
 * __useDiscsQuery__
 *
 * To run a query within a React component, call `useDiscsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDiscsQuery(baseOptions?: Apollo.QueryHookOptions<DiscsQuery, DiscsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DiscsQuery, DiscsQueryVariables>(DiscsDocument, options);
      }
export function useDiscsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DiscsQuery, DiscsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DiscsQuery, DiscsQueryVariables>(DiscsDocument, options);
        }
export type DiscsQueryHookResult = ReturnType<typeof useDiscsQuery>;
export type DiscsLazyQueryHookResult = ReturnType<typeof useDiscsLazyQuery>;
export type DiscsQueryResult = Apollo.QueryResult<DiscsQuery, DiscsQueryVariables>;