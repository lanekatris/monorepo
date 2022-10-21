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
                Authorization: '',
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
                Authorization: '',
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
