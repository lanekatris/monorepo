import React, { useCallback, useState } from 'react';
import Layout from '@theme/Layout';
import { getSdk } from '../sdk';
import { GraphQLClient } from 'graphql-request';
import { useAuth } from '@site/src/components/useAuth';
import { Unauthenticated } from '@site/src/components/unauthenticated';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import BrowserOnly from '@docusaurus/BrowserOnly';

function GpsInner(): JSX.Element {
  const { token } = useAuth();
  const [successDate, setSuccessDate] = useState<undefined | string>();
  const [saving, setSaving] = useState(false);
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const [note, setNote] = useState<undefined | string>();

  const submitGps = useCallback(async () => {
    setSaving(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const sdk = getSdk(
        new GraphQLClient(customFields.graphqlUrl as string, {
          headers: {
            'x-api-key': token,
          },
        })
      );

      const { latitude, longitude } = position.coords;
      await sdk.createFeedItem({
        input: {
          type: 'gps-coordinates-read',
          data: JSON.stringify({
            latitude,
            longitude,
            source: 'lanekatriscom',
            note,
          }),
        },
      });
      setSuccessDate(new Date().toString());
      setSaving(false);
      setNote('');
    });
  }, [token, note]);

  return (
    <Layout title="GPS Page">
      <main style={{ margin: '0 auto', width: 500, marginTop: '1em' }}>
        {!token && <Unauthenticated />}
        {token && (
          <>
            <h1>🗺️ Submit GPS Coordinates 🗺️</h1>
            <label>Note (Optional)</label>
            <div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ width: '100%', minHeight: 150 }}
              />
            </div>
            <br />
            <button onClick={submitGps} disabled={saving}>
              {saving ? 'Saving...' : 'Submit'}
            </button>{' '}
            {successDate}
          </>
        )}
      </main>
    </Layout>
  );
}

export default function GpsPage(): JSX.Element {
  return <BrowserOnly>{() => <GpsInner />}</BrowserOnly>;
}
