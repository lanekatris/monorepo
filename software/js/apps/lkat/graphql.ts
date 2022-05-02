import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';

export const PlacesDocument = gql`
    query places {
  places {
    id
    name
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    places(variables?: PlacesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PlacesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PlacesQuery>(PlacesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'places', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;