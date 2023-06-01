import { useSdk } from '@site/src/components/useSdk';
import React, { useState } from 'react';
import { format } from 'date-fns';

export function AdventureCreate() {
  const sdk = useSdk();

  const [model, setModel] = useState<{
    note?: string;
    date: string;
    activity: string;
  }>({
    date: format(new Date(), 'yyyy-MM-dd'),
    activity: 'disc-golf',
  });
  const { note, date, activity } = model;

  const onSubmit = async (e) => {
    e.preventDefault();
    await sdk.createFeedItem({
      input: {
        type: 'adventure-created',
        data: JSON.stringify({
          date,
          activity,
          note,
        }),
      },
    });
    setModel({ ...model, note: '' });
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Create Adventure</h3>
      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setModel({ ...model, date: e.target.value })}
        />
      </label>
      <label>
        Activity{' '}
        <input
          value={activity}
          onChange={(e) => setModel({ ...model, activity: e.target.value })}
        />
      </label>
      <textarea
        value={note}
        onChange={(e) => setModel({ ...model, note: e.target.value })}
        style={{ width: '100%', minHeight: 150 }}
      />
      <button type="submit">Save</button>
    </form>
  );
}
