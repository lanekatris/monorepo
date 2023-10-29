import Link from 'next/link';
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
import { getFeed } from '../feed/get-feed';
import { getMetric, Result } from '../metrics/get-metric';
const { Client } = require('pg');

export default async function Index() {
  const client = new Client({
    ssl: true,
    connectionString: process.env.POSTGRES_CONN_URL,
  });
  await client.connect();

  const { completed, total, percentage } = await getMetric(`
  select visited, count(*) as count
           from noco.place
           where source = 'https://udisc.com/blog/post/worlds-best-disc-golf-courses-2023'
           group by visited
  `);

  const {
    completed: completed2,
    total: total2,
    percentage: percentage2,
  } = await getMetric(
    `select visited, count(*) from noco.place where state_park = true and state = 'West Virginia' group by visited`
  );

  const feed = await getFeed();

  return (
    <main className="mx-5 mt-5">
      <Title>Lane&apos;s Miscellaneous Data Dashboard</Title>
      <Text>
        View my{' '}
        <Button variant="light">
          <a href="https://lanekatris.com" target="_blank">
            site
          </a>
        </Button>{' '}
        for insight on why all this exists 😉
      </Text>
      <img
        className="mt-2"
        src="https://api.netlify.com/api/v1/badges/6b9d6176-8a2c-44e4-9a44-27e96e5caa03/deploy-status"
        alt="Netlify Build Status"
      />

      <Grid numItemsMd={3} className="mt-6 gap-6">
        <Card className="max-w-xs mx-auto">
          <Text>Top 100 Disc Golf Course Completion</Text>
          <Metric>{percentage}%</Metric>
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
          <ProgressBar value={percentage} className="mt-2" color="rose" />
        </Card>

        <Card className="max-w-xs mx-auto">
          <Text>WV State Parks Visited</Text>
          <Metric>{percentage2}%</Metric>
          <Flex className="mt-4">
            <Text>
              {completed2} / {total2} Parks
            </Text>
          </Flex>
          <ProgressBar value={percentage2} className="mt-2" />
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
