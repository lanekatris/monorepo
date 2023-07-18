import React, { useState } from 'react';

export function Unauthenticated() {
  const [newToken, setNewToken] = useState('');
  return (
    <>
      <h1>Input your token to continue</h1>
      <input value={newToken} onChange={(e) => setNewToken(e.target.value)} />
      <button onClick={() => localStorage.setItem('token', newToken)}>
        Save
      </button>
    </>
  );
}
