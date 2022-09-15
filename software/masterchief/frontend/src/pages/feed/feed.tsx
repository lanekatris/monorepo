import { EventName, useFeedQuery } from '../../graphql';
import Layout from '../../components/layout';
import Select, { StylesConfig } from 'react-select';
import { useState } from 'react';

export const eventNameOptions: { value: EventName; label: EventName }[] =
  Object.values(EventName).map((x) => ({
    value: x,
    label: x,
  }));

const colourStyles: StylesConfig = {
  container: (styles) => ({
    ...styles,
    flex: 1,
  }),
};

export default function FeedPage() {
  const [filteredTypes, setFilteredTypes] = useState<EventName[]>([]);
  const { data, loading, error, refetch } = useFeedQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      input: {
        types: [],
      },
    },
  });

  return (
    <Layout>
      {/*<h4>Actions</h4>*/}
      {/*<section>*/}
      {/*  <details>*/}
      {/*    <summary>Create Event</summary>*/}
      {/*    <p>*/}
      {/*      <div id="app"></div>*/}
      {/*    </p>*/}
      {/*  </details>*/}
      {/*  <details>*/}
      {/*    <summary>Upload Pixel Notes</summary>*/}
      {/*    <p>*/}
      {/*      <form*/}
      {/*        method="post"*/}
      {/*        action="/pixel-recorder-upload"*/}
      {/*        encType="multipart/form-data"*/}
      {/*      >*/}
      {/*        <input type="file" name="files" multiple />*/}
      {/*        <input type="submit" />*/}
      {/*      </form>*/}
      {/*    </p>*/}
      {/*  </details>*/}
      {/*  <details>*/}
      {/*    <summary id="notes-title">Notes Search</summary>*/}
      {/*    <p>*/}
      {/*      <NoteSearcher />*/}
      {/*    </p>*/}
      {/*  </details>*/}
      {/*</section>*/}

      <h4>Feed ({loading ? '...' : data?.feed?.total})</h4>
      {error && <article>{JSON.stringify(error, null, 2)}</article>}
      <section>
        <details>
          <summary>Filter Events</summary>
          <div>
            <div style={{ display: 'flex' }}>
              <Select
                styles={colourStyles}
                // value={filteredTypes}
                options={eventNameOptions}
                isMulti
                onChange={(newValue) => {
                  // @ts-ignore
                  setFilteredTypes(newValue.map((x) => x.value as EventName));
                }}
                // className="basic-multi-select"
                // classNamePrefix="select"
              />
              <a
                href="#"
                role="button"
                className="outline"
                onClick={() => {
                  refetch({
                    input: {
                      types: filteredTypes,
                    },
                  });
                }}
              >
                Go
              </a>
            </div>
          </div>
        </details>
      </section>

      <ul className="feed" style={{ marginTop: 25 }}>
        {data?.feed.events.map((event) => (
          <li key={event.id}>
            [{event.date}]{' '}
            {event.__typename === 'HealthObservationEvent' && event.name}
            {event.__typename === 'ChildEvent' && event.name}
            {event.__typename === 'UnknownEvent' && 'Unknown Event'}
          </li>
        ))}
      </ul>
    </Layout>
  );
}
