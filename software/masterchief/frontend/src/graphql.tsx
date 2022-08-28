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
  status: DiscStatus;
};

export type DiscLostInput = {
  discId: Scalars['ID'];
};

export enum DiscStatus {
  InBag = 'InBag',
  Lost = 'Lost',
  Unknown = 'Unknown'
}

export type DiscStatusInput = {
  discId: Scalars['ID'];
  status: DiscStatus;
};

export type DiscsInput = {
  statuses?: InputMaybe<Array<DiscStatus>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  discLost?: Maybe<Disc>;
  discStatus?: Maybe<Disc>;
};


export type MutationDiscLostArgs = {
  input: DiscLostInput;
};


export type MutationDiscStatusArgs = {
  input: DiscStatusInput;
};

export type Query = {
  __typename?: 'Query';
  discs: Array<Disc>;
};


export type QueryDiscsArgs = {
  input?: InputMaybe<DiscsInput>;
};

export type DiscsQueryVariables = Exact<{ [key: string]: never; }>;


export type DiscsQuery = { __typename?: 'Query', discs: Array<{ __typename?: 'Disc', id: string, brand: string, model: string, number: number, color?: string | null, status: DiscStatus }> };

export type SetDiscStatusMutationVariables = Exact<{
  input: DiscStatusInput;
}>;


export type SetDiscStatusMutation = { __typename?: 'Mutation', discStatus?: { __typename?: 'Disc', id: string, brand: string, model: string, number: number, color?: string | null, status: DiscStatus } | null };


export const DiscsDocument = gql`
    query discs {
  discs {
    id
    brand
    model
    number
    color
    status
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
export const SetDiscStatusDocument = gql`
    mutation setDiscStatus($input: DiscStatusInput!) {
  discStatus(input: $input) {
    id
    brand
    model
    number
    color
    status
  }
}
    `;
export type SetDiscStatusMutationFn = Apollo.MutationFunction<SetDiscStatusMutation, SetDiscStatusMutationVariables>;

/**
 * __useSetDiscStatusMutation__
 *
 * To run a mutation, you first call `useSetDiscStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDiscStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDiscStatusMutation, { data, loading, error }] = useSetDiscStatusMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetDiscStatusMutation(baseOptions?: Apollo.MutationHookOptions<SetDiscStatusMutation, SetDiscStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDiscStatusMutation, SetDiscStatusMutationVariables>(SetDiscStatusDocument, options);
      }
export type SetDiscStatusMutationHookResult = ReturnType<typeof useSetDiscStatusMutation>;
export type SetDiscStatusMutationResult = Apollo.MutationResult<SetDiscStatusMutation>;
export type SetDiscStatusMutationOptions = Apollo.BaseMutationOptions<SetDiscStatusMutation, SetDiscStatusMutationVariables>;