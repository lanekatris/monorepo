import { useAuth } from '@site/src/components/useAuth';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useMemo } from 'react';
import { getSdk } from '@site/src/sdk';
import { GraphQLClient } from 'graphql-request';

export function useSdk() {
  const { token } = useAuth();
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  const sdk = useMemo(() => {
    return getSdk(
      new GraphQLClient(customFields.graphqlUrl as string, {
        headers: {
          'x-api-key': token,
        },
      })
    );
  }, [customFields.graphqlUrl, token]);

  return sdk;
}
