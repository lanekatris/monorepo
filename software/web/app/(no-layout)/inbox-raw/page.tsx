import { sql } from '@vercel/postgres';
import React from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import Autolinker from 'autolinker';

export default async function InboxRawPage() {
  noStore();

  const { rows: issues } = await sql`select *
                                     from models.issue`;

  const birthYear = 1991;
  const deathYear = 2071;
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  const yearsLeft =
    typeof deathYear === 'number' ? deathYear - currentYear : null;
  const weekendsLeft = yearsLeft && yearsLeft > 0 ? yearsLeft * 52 : 0;

  // son
  const sonBirth = 2021;
  const ageDadNotCool = 16;
  const yearDadNotCool = sonBirth + ageDadNotCool;
  const sonSummersLeft = yearDadNotCool - currentYear;
  const sonWeekendsLeft =
    sonSummersLeft && sonSummersLeft > 0 ? sonSummersLeft * 52 : 0;

  return (
    <>
      {issues.map((issue) => (
        <div
          key={issue.message}
          dangerouslySetInnerHTML={{ __html: Autolinker.link(issue.message) }}
        ></div>
      ))}
      <div>=============</div>

      <div>
        Your Age: <b>{age}</b>
      </div>
      <div>
        Years Left: <b>{yearsLeft}</b>
      </div>
      <div>
        Weekends Left: <b>{weekendsLeft.toLocaleString()}</b>
      </div>
      <div>=============</div>
      <div>
        Son Summers: <b>{sonSummersLeft}</b>
      </div>
      <div>
        Son Weekends: <b>{sonWeekendsLeft}</b>
      </div>

      {/*<div>(END)</div>*/}
    </>
  );
}
