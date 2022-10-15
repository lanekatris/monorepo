import Layout from '../components/layout';
import { gql, request } from 'graphql-request';
import { useState } from 'react';
import { InboxItem } from './inboxItem';

const mutation = gql`
  mutation createInbox($body: String) {
    createInbox(data: { body: $body }) {
      data {
        id
        attributes {
          body
          extra
          status
          createdAt
          vuid
          versionNumber
        }
      }
    }
  }
`;

export function DumpPage() {
  const [body, setBody] = useState('');
  return (
    <Layout>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // const data = await request(
          //   'http://100.120.122.119:1337/graphql',
          //   mutation,
          //   {
          //     body,
          //   },
          // );
          const data = await request({
            url: 'http://100.120.122.119:1337/graphql',
            document: mutation,
            variables: { body },
            requestHeaders: {
              Authorization:
                'bearer 0d82fe7998e783339e8397da6a2e10dd0a620d245ecd3fdc7974df7981f2bdc06da1059e777ae856596b4158323c77c778de4993403e1673ce69a5f1d8dd89fb690b43a13bfb4125023fa18108c726da139ad51841e3670d77730ccdb04291c6bec685269b50f3b0b90f56565366a062754fe97024e33473bee2cb9555a1fd7b',
            },
          });
          console.log('data', data);
          setBody('');
        }}
      >
        <label>
          Put anything you want:
          <textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </label>

        {/*https://www.npmjs.com/package/react-json-editor-ajrm*/}
        {/*<JSONInput id={'idk'} locale={locale} height={250} />*/}

        <button type="submit">Submit</button>
      </form>

      <div>
        <div>Did you play disc golf?</div>
        <a>Yesterday</a> - <a>Today</a>
        <div>Did you play disc golf?</div>
        <a>Yesterday</a> - <a>Today</a>
        <div>Did you play basketball?</div>
        <a>Yesterday</a> - <a>Today</a>
      </div>

      <div>
        <h5>Inbox</h5>
        <ul>
          <InboxItem body="Got PDGA Number: xx44xx3" id={1} />
          {/*<li>*/}
          {/*  Got PDGA Number: xx44xx3*/}
          {/*  <div>*/}
          {/*    <a>Ignore</a> - <a>Promote</a>*/}
          {/*  </div>*/}
          {/*</li>*/}
        </ul>
      </div>
    </Layout>
  );
}
