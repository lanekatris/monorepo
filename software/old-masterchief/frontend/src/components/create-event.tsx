import Select from 'react-select';
import { ReactElement, useState } from 'react';
import { EventName } from '../graphql';
import CreatableSelect from 'react-select/creatable';

import schema from '../pages/feed/schema.json';
import { useEventNames } from './use-event-names';

/**
 * Goal: Ability to create events as easy as possible
 *    recent events
 *    at least sort by recently used events
 *    type the kind of event you want, then it renders
 *
 */

const eventNameMapp: { [key in EventName]?: string } = {
  [EventName.NoteTaken]: 'note-taken',
  [EventName.HealthObservation]: 'health-observation',
  [EventName.MaintenanceCreated]: 'maintenance-created',
};

export default function CreateEvent() {
  const [option, setOption] = useState<{
    value: EventName;
    label: EventName;
  }>();
  const options = useEventNames();

  const targetSchema = schema.anyOf.find((x) => x.title === option?.value);

  // console.log('create-event', { option, targetSchema });

  // @ts-ignore
  const mapping: { [key in EventName]: ReactElement } = {
    HealthObservation: (
      <>
        <textarea name="body" placeholder="I saw this and that..." />
      </>
    ),
    NoteTaken: (
      <>
        <textarea name="body" placeholder="I saw this and that..." />
      </>
    ),
    MaintenanceCreated: (
      <>
        <textarea name="name" placeholder="I fixed this..." />
        <input type="text" name="equipment" />
        {/*<select name="equipment">*/}
        {/*  {Object.values(MaintenanceEquipment).map((x) => (*/}
        {/*    <option key={x} value={x}>*/}
        {/*      {x}*/}
        {/*    </option>*/}
        {/*  ))}*/}
        {/*</select>*/}
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

      <form
        method="post"
        action={`${import.meta.env.VITE_API_URL}/create-event`}
        onSubmit={(e) => {
          e.preventDefault();
          console.log('submit form ', e);
          // @ts-ignore
          const formData = new FormData(document.querySelector('form'));

          const d = formData.get('date2');
          if (d !== '') {
            // @ts-ignore
            const [hour, minute] = formData.get('time2')!.split(':');
            const formattedHour = (
              parseInt(hour) +
              new Date().getTimezoneOffset() / 60
            )
              .toString()
              .padStart(2, '0');

            console.log('final', `${d}T${formattedHour}:${minute}.000Z`);

            formData.delete('date2');
            formData.delete('time2');
            formData.set('date', `${d}T${formattedHour}:${minute}.000Z`);
            // @ts-ignore
            document.querySelector(
              'input[name="date"]',
              // @ts-ignore
            ).value = `${d}T${formattedHour}:${minute}.000Z`;
          } else {
            formData.delete('date2');
            formData.delete('time2');
          }

          for (const pair of formData.entries()) {
            console.log(pair);
          }
          // @ts-ignore
          document.querySelector('form').submit();
        }}
      >
        {/*{mapping[option?.value]}*/}
        {option && mapping[option.value]}
        {option && (
          <>
            {/*<input type="hidden" name="eventName" value={option.value} />*/}
            <input
              type="hidden"
              name="eventName"
              value={eventNameMapp[option.value]}
            />
            <input type="hidden" name="date" value="" />
            <input
              type="hidden"
              name="redirect"
              value={`${import.meta.env.VITE_ROOT_URL}/feed`}
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
                    <input type="date" name="date2" />
                    <input type="time" name="time2" />
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
