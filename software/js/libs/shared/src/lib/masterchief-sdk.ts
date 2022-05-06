import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';

export const IdkDocument = gql`
  query idk {
    adventures {
      date
      activities
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    idk(
      variables?: IdkQueryVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<IdkQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<IdkQuery>(IdkDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'idk',
        'query'
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
