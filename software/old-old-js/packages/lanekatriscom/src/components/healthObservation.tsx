import React, { useState } from 'react';
import { useSdk } from '@site/src/components/useSdk';

export function HealthObservation() {
  const [note, setNote] = useState<undefined | string>();
  const sdk = useSdk();

  const onSubmit = async (e) => {
    e.preventDefault();

    await sdk.createFeedItem({
      input: {
        type: 'health-observation',
        message: note,
      },
    });
    setNote('');
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>Health Observation</h3>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{ width: '100%', minHeight: 150 }}
      />
      <button type="submit">Save</button>
    </form>
  );
}
