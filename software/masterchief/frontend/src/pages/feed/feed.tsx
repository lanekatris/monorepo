import {
  EventName,
  useEventEditMessageMutation,
  useEventRemoveMutation,
  useEventRemoveTagMutation,
  useFeedQuery,
} from '../../graphql';
import Layout from '../../components/layout';
import Select, { StylesConfig } from 'react-select';
import { useState } from 'react';
import { groupBy } from 'lodash';
import { EditableEventMessage } from '../../components/editableEventMessage';
import { TbAmbulance } from 'react-icons/tb';
import { MdChildFriendly } from 'react-icons/md';
import { useEventNames } from '../../components/use-event-names';
import { BsCameraReels } from 'react-icons/bs';
import {
  InlineEditableTag,
  InlineEditableTags,
} from '../../components/inlineEditableField';
import { WithContext as ReactTags } from 'react-tag-input';
import { AiOutlineTag } from 'react-icons/all';
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
  const [remove] = useEventRemoveMutation();
  const options = useEventNames();
  const [removeTag] = useEventRemoveTagMutation();

  const grouped = groupBy(data?.feed.events, (x) => x.date);
  console.log('grouped', grouped);

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
                options={options}
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
        {Object.keys(grouped).map((key) => (
          <li key={key}>
            <b>{key}</b>
            <ul>
              {grouped[key].map((event) => (
                <li key={event.id} style={{ listStyle: 'none' }}>
                  {event.__typename === 'HealthObservationEvent' && (
                    <>
                      <TbAmbulance />
                      <EditableEventMessage
                        value={event.name}
                        eventId={event.id}
                      />
                    </>
                  )}
                  {event.__typename === 'ChildEvent' && (
                    <>
                      <MdChildFriendly />
                      <EditableEventMessage
                        value={event.name}
                        eventId={event.id}
                      />
                    </>
                  )}
                  {event.__typename === 'UnknownEvent' && 'Unknown Event'}
                  {event.__typename === 'MovieWatchedEvent' && (
                    <>
                      <BsCameraReels />
                      <EditableEventMessage
                        value={event.name}
                        eventId={event.id}
                      />

                      {/*<ReactTags />*/}
                    </>
                  )}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      marginLeft: 15,
                    }}
                  >
                    {/*<AiOutlineTag />*/}
                    {/*<pre>hi</pre> <pre style={{ marginLeft: 5 }}>there</pre>*/}
                    {event.tags &&
                      event.tags.map((tag) => (
                        // <pre style={{ display: 'flex', marginLeft: 10 }}>
                        //   <InlineEditableTag
                        //     value={tag.name}
                        //     key={tag.id}
                        //     eventId={event.id}
                        //   />
                        // </pre>
                        <a
                          href="#"
                          key={tag.id}
                          style={{ marginLeft: 10 }}
                          onClick={async () => {
                            await removeTag({
                              variables: {
                                input: {
                                  eventId: event.id,
                                  tagId: tag.id,
                                },
                              },
                            });
                            refetch({
                              input: {
                                types: filteredTypes,
                              },
                            });
                          }}
                        >
                          <AiOutlineTag />
                          {tag.name}
                        </a>
                      ))}
                    <InlineEditableTag
                      className="feed-item-hidden"
                      value={'Add Tag'}
                      eventId={event.id}
                      onUpdate={() => {
                        refetch({
                          input: {
                            types: filteredTypes,
                          },
                        });
                      }}
                    />
                    {/*<pre style={{ display: 'flex' }}>*/}
                    {/*  <InlineEditableTag value="testies1" />*/}
                    {/*</pre>*/}
                    {/*<pre style={{ display: 'flex' }}>*/}
                    {/*  <InlineEditableTag value="testies2" />*/}
                    {/*</pre>*/}
                  </div>
                  <a
                    href="#"
                    style={{ marginLeft: 5 }}
                    className="feed-item-hidden"
                    onClick={async () => {
                      await remove({
                        variables: {
                          eventId: event.id,
                        },
                      });
                      await refetch({
                        input: {
                          types: filteredTypes,
                        },
                      });
                    }}
                  >
                    Delete
                  </a>
                  {/*<InlineEditableTags />*/}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
