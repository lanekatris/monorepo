import Select, { StylesConfig } from 'react-select';
import { eventNameOptions } from '../pages/feed/feed';
import { SingleValue } from 'react-select/animated';
import { ReactElement, useState } from 'react';
import { EventName, useLatestEventNamesQuery } from '../graphql';

import validator from '@rjsf/validator-ajv6';
import Form from '@rjsf/core';
import CreatableSelect from 'react-select/creatable';

import schema from '../pages/feed/schema.json';

/**
 * Goal: Ability to create events as easy as possible
 *    recent events
 *    at least sort by recently used events
 *    type the kind of event you want, then it renders
 * @constructor
 */

export default function CreateEvent() {
  const [option, setOption] = useState<{
    value: EventName;
    label: EventName;
  }>();

  const { data } = useLatestEventNamesQuery();

  const options = [
    {
      label: 'Recent',
      options: (data?.latestEventNames || []).map((x) => ({
        label: x,
        value: x,
      })),
    },
    {
      label: 'All',
      options: eventNameOptions,
    },
  ];

  // const normalizedEventName = option?.value.replace('Ui ', '').replace(' ', '');

  const targetSchema = schema.anyOf.find((x) => x.title === option?.value);

  console.log('create-event', { option, targetSchema });

  // @ts-ignore
  const mapping: { [key in EventName]: ReactElement } = {
    HealthObservation: (
      <>
        <textarea name="body" placeholder="I saw this and that..." />
      </>
    ),
  };

  return (
    <>
      <div>Create Event</div>
      <p>
        <Select
          value={option}
          isSearchable
          options={options}
          onChange={(newValue) => {
            if (!newValue) return;
            setOption(newValue);
          }}
        />
      </p>

      <form method="post" action="http://localhost:3000/api/create-event">
        {/*{mapping[option?.value]}*/}
        {option && mapping[option.value]}
        {option && (
          <>
            {/*<input type="hidden" name="eventName" value={option.value} />*/}
            <input type="hidden" name="eventName" value="health-observation" />
            <input
              type="hidden"
              name="redirect"
              value="http://localhost:5173/feed"
            />
            <button className="outline" type="submit">
              Create
            </button>
            <section>
              <details>
                <summary>Extra</summary>
                <div>
                  <p>
                    <label>Tags</label>
                    <CreatableSelect isMulti />
                  </p>
                  <label>Date/Time</label>
                  <div style={{ display: 'flex' }}>
                    <input type="date" />
                    <input type="time" />
                  </div>
                </div>
              </details>
            </section>
          </>
        )}
        {/*{targetSchema && <Form schema={targetSchema} validator={validator} />}*/}
      </form>
    </>
  );
}
