import React, { useState } from 'react';
import { NextPage } from 'next';
import { DiscAdded } from '../components/discAdded';
import { DgService } from '../../server/dg/dg.service';

enum EventConfigGroup {
  DiscGolf = 'Disc Golf',
}

enum EventName {
  DiscAdded = 'disc-added',
  DiscRemoved = 'disc-removed',
}

const eventConfig = [
  {
    group: EventConfigGroup.DiscGolf,
    items: [
      {
        name: EventName.DiscAdded,
      },
      {
        name: EventName.DiscRemoved,
      },
    ],
  },
];

// export async function getServerSideProps(context) {
//   // Get discs
//   // const discs = await new DgService().getDiscs();
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// }

const Home: NextPage = () => {
  const [eventToCreate, setEventToCreate] = useState<EventName>(
    EventName.DiscAdded,
  );
  return (
    <>
      <a href="http://localhost:2113" target="_blank">
        Eventstore DB UI
      </a>
      <h1>Events Dashboard</h1>
      <div>1) Choose Event</div>
      <div>
        <select
          value={eventToCreate}
          onChange={(e) => setEventToCreate(e.target.value as EventName)}
        >
          {eventConfig.map(({ group, items }) => (
            <optgroup label={group} key={group}>
              {items.map(({ name }) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div>2) Fill In Details</div>

      {eventToCreate === EventName.DiscAdded && <DiscAdded />}
    </>
  );
};

export default Home;
