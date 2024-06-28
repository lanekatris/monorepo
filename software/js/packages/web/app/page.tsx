import Image from 'next/image';
import { getMetric } from '../metrics/get-metric';
import { sql } from '@vercel/postgres';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/joy';
// import homeImage from './2024_01_lane_troy_snow_crop.jpeg';
import homeImage from './PXL_20240512_144120828.jpg';
import HomeLinks from './Links';
import { ReactNode } from 'react';

export default async function Index() {
  const { completed, total, percentage } = await getMetric(sql`
  select visited, count(*) as count
           from noco.place
           where source = 'https://udisc.com/blog/post/worlds-best-disc-golf-courses-2023'
           group by visited
  `);

  const coursesGoal2024 = await getMetric(sql`
  select visited, count(*) as count
           from noco.place
           where source = 'https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024'
           group by visited
  `);

  const truckProgress = await getMetric(sql`
select "Done" visited,count(*) count from noco.test_workflow2 where "Type" = 'Truck' group by "Done"`);

  const truckTasks =
    await sql`select Title from noco.test_workflow2 where "Type" = 'Truck'`;

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

  // const feed = await getFeed();

  return (
    <Container>
      <br />
      <Grid container spacing={3}>
        <Grid md={6}>
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
            <Typography level="body-xs">Mothers day 2024</Typography>
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
        </Grid>
        <Grid md={6}>
          <Typography level="h4" gutterBottom>
            Workflows
          </Typography>
          <Stack spacing={2}>
            <MetricCard
              percentage={truckProgress.percentage}
              completed={truckProgress.completed}
              total={truckProgress.total}
              title="Truck (Toyota Tundra) Maintenance"
              // link="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024"
            >
              <Typography level="body-sm">
                {truckTasks.rows.map((x) => `${x.title}, `)}
              </Typography>
            </MetricCard>
          </Stack>
          <br />
          <Typography level="h4" gutterBottom>
            Goals
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
                    Top 100 Disc Golf Course Completion 2023
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

            <MetricCard
              percentage={coursesGoal2024.percentage}
              completed={coursesGoal2024.completed}
              total={coursesGoal2024.total}
              title="New Top 100 Disc Golf Course Completion 2024"
              link="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024"
            />

            <Card variant="outlined">
              <CardContent orientation="horizontal">
                <CircularProgress size="lg" determinate value={percentage2}>
                  <Typography>{percentage2}%</Typography>
                </CircularProgress>
                <CardContent>
                  <Typography level="title-lg">
                    WV State Parks Visited
                  </Typography>
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
                  <Typography level="title-lg">
                    Colorado 14ers Summited
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Typography>
                      {fourteenerStats.completed} / {fourteenerStats.total}
                    </Typography>
                    {/* */}
                    <Typography>
                      <a
                        href="https://www.lanekatris.com/Colorado-14ers"
                        target="_blank"
                        className="text-blue-600 visited:text-purple-600"
                      >
                        More Info
                      </a>
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
        </Grid>
      </Grid>
    </Container>
  );

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
        <Typography level="body-xs">Mothers day 2024</Typography>
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
        Workflows
      </Typography>
      <Stack spacing={2}>
        <MetricCard
          percentage={truckProgress.percentage}
          completed={truckProgress.completed}
          total={truckProgress.total}
          title="Truck (Toyota Tundra) Maintenance"
          // link="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024"
        >
          <Typography level="body-sm">
            {truckTasks.rows.map((x) => `${x.title}, `)}
          </Typography>
        </MetricCard>
      </Stack>
      <br />
      <Typography level="h4" gutterBottom>
        Goals
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
                Top 100 Disc Golf Course Completion 2023
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

        <MetricCard
          percentage={coursesGoal2024.percentage}
          completed={coursesGoal2024.completed}
          total={coursesGoal2024.total}
          title="New Top 100 Disc Golf Course Completion 2024"
          link="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024"
        />

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
                  {fourteenerStats.completed} / {fourteenerStats.total}
                </Typography>
                {/* */}
                <Typography>
                  <a
                    href="https://www.lanekatris.com/Colorado-14ers"
                    target="_blank"
                    className="text-blue-600 visited:text-purple-600"
                  >
                    More Info
                  </a>
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

interface Metric {
  percentage: number;
  completed: number;
  total: number;
  link?: string;
  title: string;
  children?: ReactNode;
}
function MetricCard({
  percentage,
  completed,
  total,
  link,
  title,
  children,
}: Metric) {
  return (
    <Card variant="outlined">
      <CardContent orientation="horizontal">
        <CircularProgress
          size="lg"
          color="danger"
          determinate
          value={percentage}
        >
          <Typography>{percentage}%</Typography>
        </CircularProgress>
        <CardContent>
          <Typography level="title-lg">{title}</Typography>
          <Stack direction="row" spacing={2}>
            <Typography level="body-sm">
              {completed} / {total}
            </Typography>
            {link && (
              <Typography>
                <a href={link} target="_blank">
                  More Info
                </a>
              </Typography>
            )}
          </Stack>
          {children}
        </CardContent>
      </CardContent>
    </Card>
  );
}
