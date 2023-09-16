import Link from 'next/link';
import { InferGetServerSidePropsType } from 'next';
import { GiMountainClimbing } from 'react-icons/gi';
const { Client } = require('pg');

interface Result {
  visited: boolean;
  count: string;
}

export default async function Index() {
  const client = new Client({
    ssl: true,
    connectionString: process.env.POSTGRES_CONN_URL,
  });
  await client.connect();

  const { rows }: { rows: Result[] } = await client.query(`
  select visited, count(*) as count
           from noco.place
           where source = 'https://udisc.com/blog/post/worlds-best-disc-golf-courses-2023'
           group by visited
  `);

  const { rows: rows2 }: { rows: Result[] } = await client.query(
    `select visited, count(*) from noco.place where state_park = true and state = 'West Virginia' group by visited`
  );

  const {
    rows: feed,
  }: { rows: { id: number; Date: Date; Route: string; Rating: string }[] } =
    await client.query(`
  select
    *
from noco.feed f
    left join kestra.ticks t on f.remote_id_int = t.id and f.type = 'climb'
order by t."Date" desc
  `);

  await client.end();

  const total = rows.reduce((acc, cur) => acc + Number(cur.count), 0);
  const completed = rows
    .filter((x) => x.visited)
    .reduce((acc, cur) => acc + Number(cur.count), 0);

  const total2 = rows2.reduce((acc, cur) => acc + Number(cur.count), 0);
  const completed2 = rows2
    .filter((x) => x.visited)
    .reduce((acc, cur) => acc + Number(cur.count), 0);

  // return {
  //   props: {
  //     dg: (completed / total) * 100,
  //     wv: Math.floor((completed2 / total2) * 100),
  //   },
  // };
  const dg = (completed / total) * 100;
  const wv = Math.floor((completed2 / total2) * 100);
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <main>
      <ul>
        <li>
          <Link href="/apps">Apps</Link>
        </li>
        <li>
          <Link href="/computer">Computer</Link>
        </li>
        <li>
          <Link href="/feed">Feed</Link>
        </li>
        <li>
          <Link href="/udisc-scorecard-upload">Udisc Scorecard Upload</Link>
        </li>
        <li>
          <Link href="/location-history">Location History</Link>
        </li>
      </ul>

      <hr />

      <h3>
        Top 100 Disc Golf Course Completion: <mark>{dg}%</mark>
      </h3>
      <h3>
        WV State Parks Visited: <mark>{wv}%</mark>
      </h3>
      <h3>Feed ({feed.length})</h3>
      <ul>
        {feed.map((x) => (
          <li key={x.id}>
            <GiMountainClimbing />
            {x.Date.toLocaleDateString()} - Climbed Route: {x.Route} ({x.Rating}
            )
          </li>
        ))}
      </ul>
    </main>
  );
}
