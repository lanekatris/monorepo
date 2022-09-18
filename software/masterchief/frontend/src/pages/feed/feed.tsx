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
import { InlineEditableTag } from '../../components/inlineEditableField';
import { format, parseISO } from 'date-fns';

import { AiOutlineTag, BiNote, FaBlogger, FaWrench } from 'react-icons/all';
import { getIsoDatePart, isIsoDate } from '../../utils';
import { Link } from 'react-router-dom';
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

  const grouped = groupBy(data?.feed.events, (x) => {
    return isIsoDate(x.date) ? getIsoDatePart(x.date) : x.date;
  });
  // console.log('grouped', grouped);

  return (
    <Layout>
      <h4>Feed ({loading ? '...' : data?.feed?.total})</h4>
      {error && <article>{JSON.stringify(error, null, 2)}</article>}
      <section style={{ marginBottom: 0 }}>
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

      <div className="feed">
        {Object.keys(grouped).map((key) => (
          <div key={key}>
            <b>{key}</b>
            <ul style={{ marginBottom: 0 }}>
              {grouped[key].map((event) => (
                <li
                  key={event.id}
                  className="hoverable"
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {event.__typename === 'HealthObservationEvent' && (
                    <>
                      <TbAmbulance style={{ marginRight: 5 }} />
                      {isIsoDate(event.date) && (
                        <pre
                          style={{
                            display: 'flex',
                            marginBottom: 0,
                            padding: 5,
                            marginRight: 5,
                          }}
                        >
                          {format(parseISO(event.date), 'kk:mmaaa')}
                        </pre>
                      )}
                      <EditableEventMessage
                        value={event.name}
                        eventId={event.id}
                      />
                    </>
                  )}
                  {event.__typename === 'ChildEvent' && (
                    <>
                      <MdChildFriendly style={{ marginRight: 5 }} />
                      <EditableEventMessage
                        value={event.name}
                        eventId={event.id}
                      />
                    </>
                  )}
                  {event.__typename === 'UnknownEvent' && 'Unknown Event'}
                  {event.__typename === 'MovieWatchedEvent' && (
                    <>
                      <BsCameraReels style={{ marginRight: 5 }} />
                      <EditableEventMessage
                        value={event.name}
                        eventId={event.id}
                      />

                      {/*<ReactTags />*/}
                    </>
                  )}
                  {event.__typename === 'NoteTakenEvent' && (
                    <>
                      <BiNote style={{ marginRight: 5 }} />
                      {isIsoDate(event.date) && (
                        <pre
                          style={{
                            display: 'flex',
                            marginBottom: 0,
                            padding: 5,
                            marginRight: 5,
                          }}
                        >
                          {format(parseISO(event.date), 'kk:mmaaa')}
                        </pre>
                      )}
                      <EditableEventMessage
                        value={event.body}
                        eventId={event.id}
                      />
                    </>
                  )}
                  {event.__typename === 'ArticleEditedLinkFeedEvent' && (
                    <>
                      <FaBlogger style={{ marginRight: 5 }} />
                      {isIsoDate(event.date) && (
                        <pre
                          style={{
                            display: 'flex',
                            marginBottom: 0,
                            padding: 5,
                            marginRight: 5,
                          }}
                        >
                          {format(parseISO(event.date), 'kk:mmaaa')}
                        </pre>
                      )}
                      Article: <Link to="/blog/create">{event.articleId}</Link>
                    </>
                  )}
                  {event.__typename === 'MaintenanceCreatedEvent' && (
                    <>
                      <FaWrench style={{ marginRight: 5 }} />
                      {isIsoDate(event.date) && (
                        <pre
                          style={{
                            display: 'flex',
                            marginBottom: 0,
                            padding: 5,
                            marginRight: 5,
                          }}
                        >
                          {format(parseISO(event.date), 'kk:mmaaa')}
                        </pre>
                      )}
                      <EditableEventMessage
                        value={event.name}
                        eventId={event.id}
                      />{' '}
                      - {event.equipment}
                    </>
                  )}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      marginLeft: 5,
                    }}
                  >
                    {event.tags &&
                      event.tags.map((tag) => (
                        <a
                          // href="#"
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
                  </div>
                  <span style={{ marginLeft: 5 }} className="feed-item-hidden">
                    |
                  </span>
                  <a
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
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Layout>
  );
}
