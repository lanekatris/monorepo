import React, { useState } from 'react';
import { useSdk } from '@site/src/components/useSdk';

export function CreditScore() {
  const [score, setScore] = useState<undefined | number>();
  const sdk = useSdk();

  const onSubmit = async (e) => {
    e.preventDefault();

    await sdk.createFeedItem({
      input: {
        type: 'credit-score-read',
        data: JSON.stringify({
          score,
        }),
      },
    });
  };

  return (
    <>
      <h3>Credit Score</h3>
      <form onSubmit={onSubmit}>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(+e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
export function Maintenance() {
  return (
    <>
      <h3>Maintenance Event</h3>
    </>
  );
}
