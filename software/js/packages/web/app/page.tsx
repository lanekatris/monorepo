import Link from 'next/link';
import { FeedTable } from './Idk';
import Image from 'next/image';
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
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  Stack,
  SvgIcon,
  Typography,
  useColorScheme,
} from '@mui/joy';
// import ThemeToggler from 'packages/web/app/ThemeToggler';
// import AnotherTheme from 'packages/web/app/ AnotherTheme';
import homeImage from './2024_01_lane_troy_snow_crop.jpeg';

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
    <Container maxWidth={'sm'}>
      <br />
      <Box sx={{ textAlign: 'center' }}>
        <Image
          src={homeImage}
          // width={300}
          // height={300}
          sizes={'100vw'}
          style={{
            width: '100%',
            height: 'auto',
          }}
          priority={true}
          placeholder="blur"
          alt="Lane and his son Troy in the snow"
        />
        <Typography level="body-xs">
          Land and Troy in the snow 2024-01
        </Typography>
      </Box>
      <br />
      {/*<ThemeToggler />*/}
      {/*<Typography level={'h3'}>*/}
      {/*  Lane&apos;s Miscellaneous Data Dashboard*/}
      {/*</Typography>*/}

      {/*<AnotherTheme />*/}
      {/*<ThemeToggler />*/}
      {/*<Typography gutterBottom></Typography>*/}
      <Alert color={'primary'}>
        View my
        <a href="https://lanekatris.com" target="_blank">
          site
        </a>
        for insight on why all this exists 😉
      </Alert>

      <br />
      <Typography level="h4">Links</Typography>
      <List size={'sm'}>
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
        {/*<ListItem>*/}
        {/*  <Link href="/blog">Blog </Link>*/}
        {/*  <Chip color="warning" variant="soft">*/}
        {/*    WIP*/}
        {/*  </Chip>*/}
        {/*</ListItem>*/}
      </List>

      {/*<RssSearchTest />*/}

      {/*<Grid container>*/}

      <br />
      <Typography level="h4" gutterBottom>
        Stats
      </Typography>
      <Stack spacing={2}>
        <Card variant="outlined">
          <CardContent orientation={'horizontal'}>
            <CircularProgress
              size="lg"
              determinate
              value={percentage}
              color="danger"
            >
              <Typography>{percentage}%</Typography>
            </CircularProgress>
            <CardContent>
              <Typography level="title-lg">
                Top 100 Disc Golf Course Completion
              </Typography>
              <Stack direction={'row'} spacing={2}>
                <Typography>
                  {completed} / {total} Courses
                </Typography>
                <Typography>
                  <a
                    href="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2023"
                    target="_blank"
                    className="text-blue-600 visited:text-purple-600"
                  >
                    Udisc Link
                  </a>
                </Typography>
              </Stack>
            </CardContent>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent orientation={'horizontal'}>
            <CircularProgress size="lg" determinate value={percentage2}>
              <Typography>{percentage2}%</Typography>
            </CircularProgress>
            <CardContent>
              <Typography level="title-lg">WV State Parks Visited</Typography>
              <Stack direction={'row'} spacing={2}>
                <Typography>
                  {completed2} / {total2} Parks
                </Typography>
              </Stack>
            </CardContent>
          </CardContent>
        </Card>

        {/*<Card variant={'outlined'}>*/}
        {/*  <Typography>WV State Parks Visited</Typography>*/}
        {/*  <Typography>{percentage2}%</Typography>*/}
        {/*  <Stack className="mt-4">*/}
        {/*    <Typography>*/}
        {/*      {completed2} / {total2} Parks*/}
        {/*    </Typography>*/}
        {/*  </Stack>*/}
        {/*  /!*<LinearProgress value={percentage2} className="mt-2" />*!/*/}
        {/*</Card>*/}
      </Stack>

      {/*<Card className="max-w-xs mx-auto">*/}
      {/*<Typography>Other Apps</Typography>*/}
      {/*<Divider />*/}
      {/*</Card>*/}
      {/*</Grid>*/}

      {/*<Card className="mt-6">*/}
      {/*  <Title>Feed ({feed.length})</Title>*/}
      {/*  <FeedTable rows={feed} />*/}
      {/*</Card>*/}
    </Container>
  );
}
// Index.testies = <h1>hi there</h1>;
