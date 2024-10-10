import Link from 'next/link';
import { MetricCardV2 } from '../../metrics/MetricCardV2';
import { getMetric } from '../../metrics/get-metric';
import { sql } from '@vercel/postgres';
import { HomeLinksV2 } from '../Links';
import { getFromMinio } from '../../feed/get-from-minio';

const config = [
  {
    sql: `
select pv.id is not null as visited, count(*) as count from temp.place  p
         left join temp.place_visit pv on p.friendly_id = pv.place_friendly_id
         where national_park=true
group by pv.id is not null
`,
    title: 'National Parks Visited',
    link: '/adventures/national-parks'
  },
  {
    sql: `
  select visited, count(*) as count
           from noco.place
           where source = 'https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024'
           group by visited
  `,
    title: 'Top 100 Disc Golf Course Completion 2024',
    link: 'https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024'
  },
  {
    sql: `select visited, count(*) from noco.place where state_park = true and state = 'West Virginia' group by visited`,
    title: 'WV State Parks Visited'
  },
  {
    sql: `select visited, count(*) from noco.place where source = 'Hike all 14ers in Colorado' group by visited`,
    title: 'Colorado 14ers Summited',
    link: '/adventures/14ers'
  }
];

export default async function Homev2Page() {
  const goals = await Promise.all(
    config.map(async (c) => {
      const result = await getMetric(sql.query(c.sql));
      return {
        ...result,
        ...c
      };
    })
  );

  return (
    <main>
      <p>
        Hi! I&apos;m <Link href={'/about'}>Lane Katris</Link>, a senior full
        stack software engineer at{' '}
        <Link href={'https://www.linkedin.com/company/hd-supply'}>
          HD Supply
        </Link>
        .
      </p>
      <p>
        I'm married, have a son, and am a big fan of{' '}
        <Link href={'/discs'}>Disc Golf</Link> and Rock Climbing.
      </p>
      <h3 className={'bg-active'}>Pages</h3>
      <p>Here are a few links to start with:</p>
      <HomeLinksV2 />
      <h3 className={'bg-active '}>Projects</h3>
      <p>I have a ton of unfinished projects...</p>
      <ul>
        <li>
          <Link href={'https://climb.rest'}>Climb.rest</Link>
        </li>
        <li>
          <Link href={'/homelab'}>Homelab Setup</Link>
        </li>
      </ul>
      <h3 className={'bg-active '}>Goals</h3>
      <p>Here area few goals that I'd love to accomplish more on:</p>
      <div style={{ maxWidth: 500 }}>
        {goals.map((goal) => (
          <MetricCardV2 key={goal.title} {...goal} />
        ))}
      </div>
    </main>
  );
}
