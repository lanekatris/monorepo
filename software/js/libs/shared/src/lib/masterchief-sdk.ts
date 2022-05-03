import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';

export const EventsDocument = gql`
  query events {
    events {
      events {
        id
        aggregateId
        type
        created
        data
      }
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
    events(
      variables?: EventsQueryVariables,
      requestHeaders?: Dom.RequestInit['headers']
    ): Promise<EventsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<EventsQuery>(EventsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'events',
        'query'
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
