import { useState } from 'react';
import CreateEvent from '../components/create-event';
import { gql, request } from 'graphql-request';
import { nanoid } from 'nanoid';

const mutation = gql`
  mutation createEvent($eventId: String, $date: DateTime, $body: String) {
    createEvent(
      data: { eventId: $eventId, date: $date, type: note_taken, body: $body }
    ) {
      data {
        attributes {
          body
        }
      }
    }
  }
`;

const markInboxItemProcessed = gql`
  mutation updateInbox($id: ID!) {
    updateInbox(id: $id, data: { status: processed }) {
      data {
        attributes {
          status
        }
      }
    }
  }
`;

export function InboxItem({ body, id }) {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <li>
      {body}
      <div>
        <a>Ignore</a> -{' '}
        <a onClick={() => setShowCreate(!showCreate)}>Promote</a> -{' '}
        <a
          onClick={async () => {
            console.log('create note automagically');
            const data = await request({
              url: 'http://100.120.122.119:1337/graphql',
              document: mutation,
              variables: {
                eventId: nanoid(),
                date: new Date().toISOString(),
                body,
              },
              requestHeaders: {
                Authorization:
                  'bearer 0d82fe7998e783339e8397da6a2e10dd0a620d245ecd3fdc7974df7981f2bdc06da1059e777ae856596b4158323c77c778de4993403e1673ce69a5f1d8dd89fb690b43a13bfb4125023fa18108c726da139ad51841e3670d77730ccdb04291c6bec685269b50f3b0b90f56565366a062754fe97024e33473bee2cb9555a1fd7b',
              },
            });
            console.log('data', data);
            const data2 = await request({
              url: 'http://100.120.122.119:1337/graphql',
              document: markInboxItemProcessed,
              variables: {
                id,
              },
              requestHeaders: {
                Authorization:
                  'bearer 0d82fe7998e783339e8397da6a2e10dd0a620d245ecd3fdc7974df7981f2bdc06da1059e777ae856596b4158323c77c778de4993403e1673ce69a5f1d8dd89fb690b43a13bfb4125023fa18108c726da139ad51841e3670d77730ccdb04291c6bec685269b50f3b0b90f56565366a062754fe97024e33473bee2cb9555a1fd7b',
              },
            });
          }}
        >
          Create Note
        </a>
        {showCreate && <CreateEvent />}
      </div>
    </li>
  );
}
