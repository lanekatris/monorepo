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
  List,
  ListItem,
  Stack,
  Typography
} from '@mui/joy';
// import homeImage from './2024_01_lane_troy_snow_crop.jpeg';
import homeImage from './PXL_20240512_144120828.jpg';
import fourthOfJuly from './received_2296397700699715.jpeg';
import graysPeak from './grays-peak-resized-1_Jn1kTLuiK.jpeg';
import HomeLinks from './Links';
import React, { ReactNode } from 'react';
import Link from 'next/link';
import ThisMonthActivitiesCalendar from './ThisMonthActivitiesCalendar';
import { differenceInDays, parse } from 'date-fns';
import { getMemos, getPicMemos } from '../feed/get-feed';
import Markdown from 'react-markdown';
import { MetricCard } from '../metrics/MetricCard';
import { unstable_noStore as noStore } from 'next/cache';
import { NEXT_ADVENTURE } from '../nextAdventure';
import { RawUdiscScorecardEntry } from '../scorecards/raw-udisc-scorecard-entry';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';
export default async function Index() {
  noStore();
  // const { completed, total, percentage } = await getMetric(sql`
  // select visited, count(*) as count
  //          from noco.place
  //          where source = 'https://udisc.com/blog/post/worlds-best-disc-golf-courses-2023'
  //          group by visited
  // `);

  const coursesGoal2024 = await getMetric(sql`
  select visited, count(*) as count
           from noco.place
           where source = 'https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024'
           group by visited
  `);

  const nationalParks = await getMetric(sql`
select pv.id is not null as visited, count(*) as count from temp.place  p
         left join temp.place_visit pv on p.friendly_id = pv.place_friendly_id
         where national_park=true
group by pv.id is not null
`);

  //   const truckProgress = await getMetric(sql`
  // select "Done" visited,count(*) count from noco.test_workflow2 where "Type" = 'Truck' group by "Done"`);
  //
  //   const truckTasks =
  //     await sql`select Title from noco.test_workflow2 where "Type" = 'Truck'`;

  const {
    completed: completed2,
    total: total2,
    percentage: percentage2
  } = await getMetric(
    sql`select visited, count(*) from noco.place where state_park = true and state = 'West Virginia' group by visited`
  );

  const fourteenerStats = await getMetric(
    sql`select visited, count(*) from noco.place where source = 'Hike all 14ers in Colorado' group by visited`
  );

  const {
    rows: recentRounds
  }: {
    rows: RawUdiscScorecardEntry[];
  } =
    await sql`select * from kestra.udisc_scorecard where playername = 'Lane' order by startdate desc limit 3`;

  const { rows: rawAdventureDates }: { rows: { date: string }[] } =
    await sql`select date from kestra.obsidian_adventures where date::date >= date_trunc('year', CURRENT_DATE)`;

  const recentActivities = rawAdventureDates.map((x) =>
    parse(x.date, 'yyyy-MM-dd', new Date())
  );

  const {
    rows: recentClimbs
  }: {
    rows: {
      Date: Date;
      Route: string;
      Rating: string;
      url: string;
      id: number;
      Notes: string;
    }[];
  } = await sql`select * from kestra.ticks order by "Date" desc limit 3`;

  const memos = await getMemos();
  const picMemos = await getPicMemos();

  interface L {
    url: string;
  }
  const { rows: dgLinks }: { rows: L[] } =
    await sql`select url from noco.url where id = 1`;

  const { rows: kickObsidianAdventuresLinks }: { rows: L[] } =
    await sql`select url from noco.url where id = 4`;

  const session = await getServerSession();
  console.log('session', session);

  // const {
  //   rows: activityGrouping,
  // }: { rows: { name: string; value: number }[] } =
  //   await sql`select activity as name,count(*) as value from kestra.obsidian_adventures group by activity order by count(*) desc`;

  return (
    <Container>
      <br />

      <Grid container spacing={3}>
        <Grid md={6}>
          {/*<br />*/}
          <Image
            src={graysPeak}
            sizes="100vw"
            style={{
              width: '100%',
              height: 'auto'
            }}
            priority={true}
            placeholder="blur"
            alt="Lane on top of Grays Peak, a 14er in Colorado"
          />
          <Typography gutterBottom level="body-xs">
            Lane on top of Grays Peak, a 14er in Colorado
          </Typography>
          <Alert color="primary">
            Hi! I&apos;m{' '}
            <Link href="about" style={{ display: 'contents' }}>
              Lane Katris
            </Link>{' '}
            , a senior full stack software engineer. This site is a hodge podge
            of data and things I enjoy. The links below are a few places to
            start with.
          </Alert>

          <br />
          <Typography level="h4">Pages</Typography>
          <HomeLinks />
        </Grid>
        <Grid md={6}>
          {/*<Box textAlign="center">*/}
          {/* */}
          {/*</Box>*/}

          <Alert
            size="lg"
            color="danger"
            sx={{ alignItems: 'flex-start' }}
            // variant="outlined"
          >
            <Typography>
              <b>Next Adventure Not Planned, Ideas:</b> {NEXT_ADVENTURE}
            </Typography>
          </Alert>

          <Typography level="h4" gutterBottom>
            Goals
          </Typography>
          <Stack spacing={2}>
            <MetricCard
              percentage={nationalParks.percentage}
              completed={nationalParks.completed}
              total={nationalParks.total}
              title="National Parks Visited"
              link="/adventures/national-parks"
            />

            {/*<Card variant="outlined">*/}
            {/*  <CardContent orientation="horizontal">*/}
            {/*    <CircularProgress*/}
            {/*      size="lg"*/}
            {/*      determinate*/}
            {/*      value={percentage}*/}
            {/*      color="danger"*/}
            {/*    >*/}
            {/*      <Typography>{percentage}%</Typography>*/}
            {/*    </CircularProgress>*/}
            {/*    <CardContent>*/}
            {/*      <Typography level="title-lg">*/}
            {/*        Top 100 Disc Golf Course Completion 2023*/}
            {/*      </Typography>*/}
            {/*      <Stack direction="row" spacing={2}>*/}
            {/*        <Typography>*/}
            {/*          {completed} / {total} Courses*/}
            {/*        </Typography>*/}
            {/*        <Typography>*/}
            {/*          <a*/}
            {/*            href="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2023"*/}
            {/*            target="_blank"*/}
            {/*            className="text-blue-600 visited:text-purple-600"*/}
            {/*          >*/}
            {/*            Udisc Link*/}
            {/*          </a>*/}
            {/*        </Typography>*/}
            {/*      </Stack>*/}
            {/*    </CardContent>*/}
            {/*  </CardContent>*/}
            {/*</Card>*/}

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

            <MetricCard
              percentage={fourteenerStats.percentage}
              completed={fourteenerStats.completed}
              total={fourteenerStats.total}
              title="Colorado 14ers Summited"
              // link="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024"
              link="/adventures/14ers"
            />
          </Stack>
          <br />
          <Stack direction="row" justifyContent="space-between">
            <Typography level="h4">Activities This Year</Typography>
            <Typography level="body-xs">
              <Link
                href="https://timeline.google.com/maps/timeline?hl=en&authuser=0&pli=1&rapt=AEjHL4OuTb6QVbcwylFSNprJeSNg3mIxuOaf4UriQxjFGOQJ7DpBVlJogCBrm8wEJfo6XyRrbZk30Wr0bTDKcwY6PE2znvkPptI_KfP6Lm3zYbu07fgfr78&pb=!1m2!1m1!1s2024-08-23"
                target={'_blank'}
              >
                Google Timeline
              </Link>{' '}
              | <Link href={kickObsidianAdventuresLinks[0].url}>Refresh</Link>
            </Typography>
          </Stack>
          <ThisMonthActivitiesCalendar dates={recentActivities} />
          <br />

          <Stack direction="row" justifyContent="space-between">
            <Typography level="h4">Recent Disc Golf Rounds</Typography>
            <Typography level="body-xs">
              <Link href="/dg/rounds">All Rounds</Link> |{' '}
              <Link href={dgLinks[0].url}>Upload</Link>
            </Typography>
          </Stack>
          <Typography gutterBottom level="body-md">
            (It has been{' '}
            <b>{differenceInDays(new Date(), recentRounds[0].startdate)}</b>{' '}
            day(s) since I&apos;ve played disc golf or uploaded my scorecards)
          </Typography>
          <List size="sm" sx={{ backgroundColor: '#ffffce' }}>
            {recentRounds.map((round) => (
              <ListItem key={round.coursename + round.startdate.toString()}>
                {round.startdate.toLocaleDateString()}: <b>{round['+/-']}</b> @{' '}
                {round.coursename}
              </ListItem>
            ))}
          </List>

          <Typography level="h4">Recent Climbs</Typography>

          <List size="sm" sx={{ backgroundColor: '#ffffce' }}>
            {recentClimbs.map((climb) => (
              <ListItem key={climb.id}>
                {climb.Date.toLocaleDateString()}:{' '}
                <a target="_blank" href={climb.url}>
                  {climb.Route} ({climb.Rating})
                </a>{' '}
              </ListItem>
            ))}
          </List>

          <Stack direction="row" justifyContent="space-between">
            <Typography level="h4">Recent Notes</Typography>
            <Link href="https://memo.lkat.io/">All Notes</Link>
          </Stack>

          <List size="sm" sx={{ backgroundColor: '#ffffce' }}>
            {memos.slice(0, 3).map((memo) => (
              <ListItem key={memo.id}>
                {/*{JSON.stringify(memo)}*/}
                <b>{memo.data.memo?.displayTime?.split('T')[0]}</b>:
                {/*<a target="_blank" href={climb.url}>*/}
                {/*  {climb.Route} ({climb.Rating})*/}
                {/*</a>{' '}*/}
                <Markdown>{memo.data.memo?.content.slice(0, 100)}</Markdown>...
              </ListItem>
            ))}
          </List>

          {/*<br />*/}

          <br />
          {/*<Typography level="h4" gutterBottom>*/}
          {/*  Workflows*/}
          {/*</Typography>*/}
          {/*<Stack spacing={2}>*/}
          {/*  <MetricCard*/}
          {/*    percentage={truckProgress.percentage}*/}
          {/*    completed={truckProgress.completed}*/}
          {/*    total={truckProgress.total}*/}
          {/*    title="Truck (Toyota Tundra) Maintenance"*/}
          {/*    // link="https://udisc.com/blog/post/worlds-best-disc-golf-courses-2024"*/}
          {/*  >*/}
          {/*    <Typography level="body-sm">*/}
          {/*      {truckTasks.rows.map((x) => `${x.title}, `)}*/}
          {/*    </Typography>*/}
          {/*  </MetricCard>*/}
          {/*</Stack>*/}
        </Grid>
      </Grid>
      <br />
      <Box sx={{ textAlign: 'center', maxWidth: 500 }}>
        <Typography level="h4">Photos</Typography>
        <Image
          src={fourthOfJuly}
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto'
          }}
          priority={true}
          placeholder="blur"
          alt="4th of July 2024"
        />
        <Typography level="body-xs">4th of July 2024</Typography>
        <Image
          src={homeImage}
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto'
          }}
          priority={true}
          placeholder="blur"
          alt="Troy and his mom"
        />
        <Typography level="body-xs">Mothers day 2024</Typography>
        {picMemos.map((memo) => (
          <Box key={memo.uid}>
            {memo.resources.map((rl) => (
              <img
                loading={'lazy'}
                // height={100}
                // width={100}
                key={rl.filename}
                alt={rl.filename}
                width={'100%'}
                src={`https://memo.lkat.io/file/${rl.name}/${rl.filename}`}
              />
            ))}
            {memo.displayTime.split('T')[0]}
            <Markdown>{memo.content.replace('#pic', '')}</Markdown>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
