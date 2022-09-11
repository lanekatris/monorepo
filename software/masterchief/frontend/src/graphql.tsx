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
  DateTime: any;
};

export type Disc = {
  __typename?: 'Disc';
  brand: Scalars['String'];
  color?: Maybe<Scalars['String']>;
  date: Scalars['String'];
  deleted: Scalars['Boolean'];
  id: Scalars['String'];
  model: Scalars['String'];
  number: Scalars['Float'];
  status: DiscStatus;
};

export type DiscColorInput = {
  color: Scalars['String'];
  discId: Scalars['ID'];
};

export type DiscCreateInput = {
  brand: Scalars['String'];
  color?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<Scalars['DateTime']>;
  model: Scalars['String'];
};

export type DiscLostInput = {
  discId: Scalars['ID'];
};

export type DiscRemoveInput = {
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
  discColor?: Maybe<Disc>;
  discCreate: Disc;
  discLost?: Maybe<Disc>;
  discRemove: Disc;
  discStatus?: Maybe<Disc>;
};


export type MutationDiscColorArgs = {
  input: DiscColorInput;
};


export type MutationDiscCreateArgs = {
  input: DiscCreateInput;
};


export type MutationDiscLostArgs = {
  input: DiscLostInput;
};


export type MutationDiscRemoveArgs = {
  input: DiscRemoveInput;
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

export type AllDiscPropsFragment = { __typename?: 'Disc', id: string, brand: string, model: string, number: number, color?: string | null, status: DiscStatus, deleted: boolean };

export type DiscsQueryVariables = Exact<{ [key: string]: never; }>;


export type DiscsQuery = { __typename?: 'Query', discs: Array<{ __typename?: 'Disc', id: string, brand: string, model: string, number: number, color?: string | null, status: DiscStatus, deleted: boolean }> };

export type SetDiscStatusMutationVariables = Exact<{
  input: DiscStatusInput;
}>;


export type SetDiscStatusMutation = { __typename?: 'Mutation', discStatus?: { __typename?: 'Disc', id: string, brand: string, model: string, number: number, color?: string | null, status: DiscStatus, deleted: boolean } | null };

export type SetDiscColorMutationVariables = Exact<{
  input: DiscColorInput;
}>;


export type SetDiscColorMutation = { __typename?: 'Mutation', discColor?: { __typename?: 'Disc', id: string, brand: string, model: string, number: number, color?: string | null, status: DiscStatus, deleted: boolean } | null };

export type DiscCreateMutationVariables = Exact<{
  input: DiscCreateInput;
}>;


export type DiscCreateMutation = { __typename?: 'Mutation', discCreate: { __typename?: 'Disc', id: string, brand: string, model: string, number: number, color?: string | null, status: DiscStatus, deleted: boolean } };

export type DiscRemoveMutationVariables = Exact<{
  input: DiscRemoveInput;
}>;


export type DiscRemoveMutation = { __typename?: 'Mutation', discRemove: { __typename?: 'Disc', id: string, deleted: boolean } };

export const AllDiscPropsFragmentDoc = gql`
    fragment AllDiscProps on Disc {
  id
  brand
  model
  number
  color
  status
  deleted
}
    `;
export const DiscsDocument = gql`
    query discs {
  discs {
    ...AllDiscProps
  }
}
    ${AllDiscPropsFragmentDoc}`;

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
    ...AllDiscProps
  }
}
    ${AllDiscPropsFragmentDoc}`;
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
export const SetDiscColorDocument = gql`
    mutation setDiscColor($input: DiscColorInput!) {
  discColor(input: $input) {
    ...AllDiscProps
  }
}
    ${AllDiscPropsFragmentDoc}`;
export type SetDiscColorMutationFn = Apollo.MutationFunction<SetDiscColorMutation, SetDiscColorMutationVariables>;

/**
 * __useSetDiscColorMutation__
 *
 * To run a mutation, you first call `useSetDiscColorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDiscColorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDiscColorMutation, { data, loading, error }] = useSetDiscColorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetDiscColorMutation(baseOptions?: Apollo.MutationHookOptions<SetDiscColorMutation, SetDiscColorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDiscColorMutation, SetDiscColorMutationVariables>(SetDiscColorDocument, options);
      }
export type SetDiscColorMutationHookResult = ReturnType<typeof useSetDiscColorMutation>;
export type SetDiscColorMutationResult = Apollo.MutationResult<SetDiscColorMutation>;
export type SetDiscColorMutationOptions = Apollo.BaseMutationOptions<SetDiscColorMutation, SetDiscColorMutationVariables>;
export const DiscCreateDocument = gql`
    mutation discCreate($input: DiscCreateInput!) {
  discCreate(input: $input) {
    ...AllDiscProps
  }
}
    ${AllDiscPropsFragmentDoc}`;
export type DiscCreateMutationFn = Apollo.MutationFunction<DiscCreateMutation, DiscCreateMutationVariables>;

/**
 * __useDiscCreateMutation__
 *
 * To run a mutation, you first call `useDiscCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDiscCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [discCreateMutation, { data, loading, error }] = useDiscCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDiscCreateMutation(baseOptions?: Apollo.MutationHookOptions<DiscCreateMutation, DiscCreateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DiscCreateMutation, DiscCreateMutationVariables>(DiscCreateDocument, options);
      }
export type DiscCreateMutationHookResult = ReturnType<typeof useDiscCreateMutation>;
export type DiscCreateMutationResult = Apollo.MutationResult<DiscCreateMutation>;
export type DiscCreateMutationOptions = Apollo.BaseMutationOptions<DiscCreateMutation, DiscCreateMutationVariables>;
export const DiscRemoveDocument = gql`
    mutation discRemove($input: DiscRemoveInput!) {
  discRemove(input: $input) {
    id
    deleted
  }
}
    `;
export type DiscRemoveMutationFn = Apollo.MutationFunction<DiscRemoveMutation, DiscRemoveMutationVariables>;

/**
 * __useDiscRemoveMutation__
 *
 * To run a mutation, you first call `useDiscRemoveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDiscRemoveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [discRemoveMutation, { data, loading, error }] = useDiscRemoveMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDiscRemoveMutation(baseOptions?: Apollo.MutationHookOptions<DiscRemoveMutation, DiscRemoveMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DiscRemoveMutation, DiscRemoveMutationVariables>(DiscRemoveDocument, options);
      }
export type DiscRemoveMutationHookResult = ReturnType<typeof useDiscRemoveMutation>;
export type DiscRemoveMutationResult = Apollo.MutationResult<DiscRemoveMutation>;
export type DiscRemoveMutationOptions = Apollo.BaseMutationOptions<DiscRemoveMutation, DiscRemoveMutationVariables>;