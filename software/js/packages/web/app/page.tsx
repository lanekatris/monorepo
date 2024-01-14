import Link from 'next/link';
import { FeedTable } from './Idk';
// import {
//   Button,
//   Card,
//   Flex,
//   Grid,
//   List,
//   ListItem,
//   Metric,
//   ProgressBar,
//   Text,
//   Title,
// } from '@tremor/react';
import { getFeed } from '../feed/get-feed';
import { getMetric } from '../metrics/get-metric';
import RssSearchTest from './RssSearchTest';
import { sql } from '@vercel/postgres';
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/joy';

export default async function Index() {
  const { completed, total, percentage } = await getMetric(sql`
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
    sql`select visited, count(*) from noco.place where state_park = true and state = 'West Virginia' group by visited`
  );

  // const feed = await getFeed();

  return (
    <Container>
      <Typography level={'h3'}>
        Lane&apos;s Miscellaneous Data Dashboard
      </Typography>
      <Typography>
        View my{' '}
        <a href="https://lanekatris.com" target="_blank">
          site
        </a>{' '}
        for insight on why all this exists 😉
      </Typography>
      <img
        className="mt-2"
        src="https://api.netlify.com/api/v1/badges/6b9d6176-8a2c-44e4-9a44-27e96e5caa03/deploy-status"
        alt="Netlify Build Status"
      />

      {/*<RssSearchTest />*/}

      <Grid container>
        <Card className="max-w-xs mx-auto">
          <CardContent>
            <Typography>Top 100 Disc Golf Course Completion</Typography>
            <Typography>{percentage}%</Typography>
            <Stack className="mt-4">
              <Typography>
                {completed} / {total} Courses
              </Typography>
              <Typography>
                <a
                  href="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2023"
                  target="_blank"
                  className="text-blue-600 visited:text-purple-600"
                >
                  Link
                </a>
              </Typography>
            </Stack>
            {/*<LinearProgress determinate value={percentage} size={'sm'} />*/}
          </CardContent>
        </Card>

        <Card className="max-w-xs mx-auto">
          <Typography>WV State Parks Visited</Typography>
          <Typography>{percentage2}%</Typography>
          <Stack className="mt-4">
            <Typography>
              {completed2} / {total2} Parks
            </Typography>
          </Stack>
          {/*<LinearProgress value={percentage2} className="mt-2" />*/}
        </Card>

        <Card className="max-w-xs mx-auto">
          <Typography>Other Apps</Typography>
          {/*<Divider />*/}
          <List className="mt-3">
            <ListItem>
              <Link href="/location-history">Location History</Link>
            </ListItem>
            <ListItem>
              <Link href="/discs">Discs</Link>
            </ListItem>
            <ListItem>
              <Link href="/climb/logger">Climb Logger</Link>
            </ListItem>
            <ListItem>
              <Link href="/climb/gym-users">Gym Users</Link>
            </ListItem>
            <ListItem>
              <Link href="/fitness">Fitness</Link>
            </ListItem>
            <ListItem>
              <Link href="/spotify">Spotify & My Podcasts</Link>
            </ListItem>
            <ListItem>
              <Link href="/search">Search</Link>
            </ListItem>
          </List>
        </Card>
      </Grid>

      {/*<Card className="mt-6">*/}
      {/*  <Title>Feed ({feed.length})</Title>*/}
      {/*  <FeedTable rows={feed} />*/}
      {/*</Card>*/}
    </Container>
  );
}
