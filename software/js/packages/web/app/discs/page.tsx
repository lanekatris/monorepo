import {
  Alert,
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  Container,
  Link,
  List,
  ListItem,
  Stack,
  Table,
  Typography,
} from '@mui/joy';
// @ts-ignore
import { sql } from '@vercel/postgres';
import { Pie, ResponsiveContainer } from 'recharts';
import { RawUdiscScorecardEntry } from 'packages/scorecards/src/raw-udisc-scorecard-entry';
import { processScorecards } from 'packages/scorecards/src/process-scorecards';
import { groupBy } from 'lodash';
import { formatRelative } from 'date-fns';
// import DiscsChart from 'packages/web/app/discs/DiscsCharts';

export interface Disc {
  brand: string;
  color: string;
  model: string;
  plastic: string;
  number: bigint;
  status: string;
  weight: number;
  created: Date;
  price: number;
  notes: string;
  aces: bigint;
  id: number;
  created_at: Date;
  updated_at: Date;
  LostDate: Date;
}

async function GetRawScorecards() {
  const { rows }: { rows: RawUdiscScorecardEntry[] } = await sql`select
*
     from kestra.udisc_scorecard order by startdate desc`;
  return rows;
}
export const dynamic = 'force-dynamic';
export default async function DiscsPage() {
  const { rows }: { rows: Disc[] } =
    await sql`select * from noco."disc" order by id desc`;

  const rawScorecards = await GetRawScorecards();
  const scorecardResult = await processScorecards({
    rawScorecards,
    playerName: 'Lane',
  });

  const latestRound = rawScorecards[0];
  const total = rows.length;
  const totalInBag = rows.filter((x) => x.status === 'In Bag').length;
  const discStatuses = groupBy(rows, 'status');

  const { rows: courses }: { rows: { coursename: string }[] } =
    await sql`select distinct coursename from kestra.udisc_scorecard order by coursename`;

  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Disc Golf Dashboard</Typography>
      </Breadcrumbs>
      <Typography level="h4" id="toc">
        TOC
      </Typography>
      <List size="sm">
        <ListItem>
          <Link href="#my-discs">My Discs</Link>
        </ListItem>
        <ListItem>
          <Link href="#courses">Courses I've Played</Link>
        </ListItem>
      </List>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography level="h4">Stats</Typography>
        <Typography level="body-sm">
          Updated: {formatRelative(latestRound.startdate, new Date())}
        </Typography>
      </Stack>
      {/*<List size="sm">*/}
      <Alert color="primary">
        I've been using Udisc for{' '}
        {scorecardResult.stats.howLongHaveYouBeenPlaying}, I have{' '}
        {scorecardResult.stats.aces} Aces, and have recorded{' '}
        {scorecardResult.stats.rounds.total} rounds. I've recorded rounds at:{' '}
        {scorecardResult.stats.courses.mostPlayed.name} the most -{' '}
        {scorecardResult.stats.courses.mostPlayed.rounds} times.
        <br />
        {/*<br />*/}
        Want to see your Udisc stats outside the app? (Coming Soon)
      </Alert>
      <br />
      <Typography level="h4" gutterBottom id="my-discs">
        My Discs
      </Typography>
      <Alert color="primary">
        I currently have {totalInBag} discs in my bag
      </Alert>
      <br />
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip>Total: {total}</Chip>
        {Object.keys(discStatuses).map((key) => (
          <Chip key={key}>
            {key}: {discStatuses[key].length}
          </Chip>
        ))}
      </Stack>
      <br />
      <Stack gap={1}>
        {rows.map((disc) => (
          <Card key={disc.id} size="sm">
            <CardContent>
              <Typography level="body-xs">ID: {disc.id}</Typography>
              <Typography level="title-lg">
                {disc.color} - {disc.plastic} {disc.brand} {disc.model}
              </Typography>
              <Typography level="body-sm" gutterBottom>
                {disc.notes || 'No notes'}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" justifyContent="space-between" gap={1}>
                  <Chip variant="solid">{disc.status}</Chip>
                  <Chip variant="solid">{disc.weight || 'n/a '}g</Chip>
                </Stack>
                <Typography level="body-xs">
                  Added: {disc.created?.toLocaleDateString() || 'Unknown'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <br />
      <Link href="#toc">Back to Top</Link>
      <br />
      <br />
      <Typography level="h4" id="courses">
        Unique Courses <Chip>Count: {courses.length}</Chip>
      </Typography>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(({ coursename }) => (
            <tr key={coursename}>
              <td>{coursename}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
      <Link href="#toc">Back to Top</Link>
    </Container>
  );
}
