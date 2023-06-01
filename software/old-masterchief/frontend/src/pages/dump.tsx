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
              Authorization: '',
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
