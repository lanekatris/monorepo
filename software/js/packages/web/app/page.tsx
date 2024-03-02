import Link from 'next/link';
import Image from 'next/image';
import { getMetric } from '../metrics/get-metric';
import { sql } from '@vercel/postgres';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/joy';
import homeImage from './2024_01_lane_troy_snow_crop.jpeg';
import HomeLinks from 'packages/web/app/Links';

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

  const fourteenerStats = await getMetric(
    sql`select visited, count(*) from noco.place where source = 'Hike all 14ers in Colorado' group by visited`
  );

  console.log(fourteenerStats);

  // const feed = await getFeed();

  return (
    <Container maxWidth="sm">
      <br />
      <Box sx={{ textAlign: 'center' }}>
        <Image
          src={homeImage}
          sizes="100vw"
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
      <Alert color="primary">
        View my
        <a href="https://lanekatris.com" target="_blank">
          site
        </a>
        for insight on why all this exists 😉
      </Alert>

      <br />
      <Typography level="h4">Links</Typography>
      <HomeLinks />

      {/*<RssSearchTest />*/}

      {/*<Grid container>*/}

      <br />
      <Typography level="h4" gutterBottom>
        Stats
      </Typography>
      <Stack spacing={2}>
        <Card variant="outlined">
          <CardContent orientation="horizontal">
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
              <Stack direction="row" spacing={2}>
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
          <CardContent orientation="horizontal">
            <CircularProgress size="lg" determinate value={percentage2}>
              <Typography>{percentage2}%</Typography>
            </CircularProgress>
            <CardContent>
              <Typography level="title-lg">WV State Parks Visited</Typography>
              <Stack direction="row" spacing={2}>
                <Typography>
                  {completed2} / {total2} Parks
                </Typography>
              </Stack>
            </CardContent>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent orientation="horizontal">
            <CircularProgress
              size="lg"
              color="danger"
              determinate
              value={fourteenerStats.percentage}
            >
              <Typography>{fourteenerStats.percentage}%</Typography>
            </CircularProgress>
            <CardContent>
              <Typography level="title-lg">Colorado 14ers Summited</Typography>
              <Stack direction="row" spacing={2}>
                <Typography>
                  {fourteenerStats.completed} / {fourteenerStats.total} 14ers
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
