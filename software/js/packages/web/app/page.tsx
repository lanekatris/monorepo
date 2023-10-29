import Link from 'next/link';
import { InferGetServerSidePropsType } from 'next';
import {
  GiDiscGolfBasket,
  GiMountainClimbing,
  GiMountains,
} from 'react-icons/gi';
import Navigation from 'packages/web/layout/navigation';
import { CgDisc } from 'react-icons/cg';
import { FeedTable, Idk } from './Idk';
import {
  Card,
  Text,
  Flex,
  Grid,
  Metric,
  ProgressBar,
  Title,
  List,
  ListItem,
  Button,
  Divider,
} from '@tremor/react';
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
  }: {
    rows: {
      id: string;
      type:
        | 'disc-golf-scorecard'
        | 'climb'
        | 'disc-golf-disc'
        | 'obsidian-adventure';
      date: Date;
      data: {
        climb?: { Route: string; Rating: string };
        scorecard?: { coursename: string; '+/-': number };
        disc?: {
          brand: string;
          model: string;
          plastic: string;
          number: number;
          weight?: number;
        };
        adventure?: { activity: string };
      };
    }[];
  } = await client.query(`
with x as (select
 case
                   when f.type = 'climb' then concat('climb-', t.id)
                  when f.type = 'disc-golf-scorecard' then concat('scorecard-', u.id)
     when f.type = 'disc-golf-disc' then concat('disc-',d.id)
     when f.type = 'obsidian-adventure' then concat('obsidian-adventure-', oa.id)
                end as id,
f.type,
                  case
                      when f.type = 'climb' then t."Date"::date
                      when f.type = 'disc-golf-scorecard' then u."date"::date
                      when f.type = 'disc-golf-disc' then coalesce(d.created, d.created_at)::date
                      when f.type = 'obsidian-adventure' then oa.date::date
                      end as date,
                  json_build_object(
                          'climb', t.*,
                          'scorecard', u.*,
                            'disc', d.*,
                            'adventure', oa.*
                      )   as data
           from noco.feed f
                    left join kestra.ticks t on f.remote_id_int = t.id and f.type = 'climb'
                    left join kestra.udisc_scorecard u on f.remote_id_int = u.id and f.type = 'disc-golf-scorecard'
                    left join noco.disc d on f.remote_id_int = d.id and f.type = 'disc-golf-disc'
                    left join kestra.obsidian_adventures oa on f.remote_id_int = oa.id and f.type = 'obsidian-adventure'
)
select * from x order by date desc;
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

  const dg = (completed / total) * 100;
  const wv = Math.floor((completed2 / total2) * 100);

  return (
    <main className="mx-5 mt-5">
      <Title>Lane's Miscellaneous Data Dashboard</Title>
      <Text>
        View my{' '}
        <Button variant="light">
          <a href="https://lanekatris.com" target="_blank">
            site
          </a>
        </Button>{' '}
        for insight on why all this exists 😉
      </Text>

      <Grid numItemsMd={3} className="mt-6 gap-6">
        <Card className="max-w-xs mx-auto">
          <Text>Top 100 Disc Golf Course Completion</Text>
          <Metric>{dg}%</Metric>
          <Flex className="mt-4">
            <Text>
              {completed} / {total} Courses
            </Text>
            <Text>
              <a
                href="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2023"
                target="_blank"
                className="text-blue-600 visited:text-purple-600"
              >
                Link
              </a>
            </Text>
          </Flex>
          <ProgressBar value={dg} className="mt-2" color="rose" />
        </Card>

        <Card className="max-w-xs mx-auto">
          <Text>WV State Parks Visited</Text>
          <Metric>{wv}%</Metric>
          <Flex className="mt-4">
            <Text>
              {completed2} / {total2} Parks
            </Text>
            {/*<Text>$ 225,000</Text>*/}
          </Flex>
          <ProgressBar value={wv} className="mt-2" />
        </Card>

        <Card className="max-w-xs mx-auto">
          <Text>Other Apps</Text>
          {/*<Divider />*/}
          <List className="mt-3">
            <ListItem>
              <Button variant="light">
                <Link href="/location-history">Location History</Link>
              </Button>
            </ListItem>
            <ListItem>
              <Button variant="light">
                <Link href="/discs">Discs</Link>
              </Button>
            </ListItem>
          </List>
        </Card>
      </Grid>

      <Card className="mt-6">
        <Title>Feed ({feed.length})</Title>
        <FeedTable rows={feed} />
      </Card>
    </main>
  );
}
