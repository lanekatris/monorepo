import { sql } from '@vercel/postgres';
import React from 'react';
import { unstable_noStore as noStore } from 'next/cache';

export default async function InboxRawPage() {
  noStore();

  const { rows: issues } = await sql`select * from models.issue`;

  if (issues.length === 0) return <p>No To Dos</p>;

  return (
    <>
      {/*<div>(START)</div>*/}
      {issues.map((issue) => (
        <div key={issue.message}>{issue.message}</div>
      ))}

      {/*<div>(END)</div>*/}
    </>
  );
}
