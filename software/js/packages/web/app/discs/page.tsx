import {
  Alert,
  Breadcrumbs,
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

export default async function DiscsPage() {
  const { rows }: { rows: Disc[] } =
    await sql`select * from noco."disc" order by id desc`;

  const rawScorecards = await GetRawScorecards();
  // console.log('rawcorecardsx', rawScorecards[0]);
  const scorecardResult = await processScorecards({
    rawScorecards,
    playerName: 'Lane',
  });
  // console.log('scoreme', rawScorecards[0], rawScorecards[1]);
  // console.log('score', scorecardResult);

  const latestRound = rawScorecards[0];
  const total = rows.length;
  const totalInBag = rows.filter((x) => x.status === 'In Bag').length;
  const discStatuses = groupBy(rows, 'status');
  // console.log('ii', discStatuses);

  // console.log(rows[0]);

  const { rows: courses }: { rows: { coursename: string }[] } =
    await sql`select distinct coursename from kestra.udisc_scorecard order by coursename`;

  // console.log('courses', courses);

  // const [idk, setidk] = useState('');
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
      {/*<br />*/}
      {/*<br />*/}
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
      {/*<ListItem>*/}
      {/*  Most Played Course:{' '}*/}
      {/*  <b>*/}
      {/*    {scorecardResult.stats.courses.mostPlayed.name} (*/}
      {/*    {scorecardResult.stats.courses.mostPlayed.rounds} Times)*/}
      {/*  </b>*/}
      {/*</ListItem>*/}
      {/*</List>*/}
      {/*<Table>*/}
      {/*  <tbody>*/}
      {/*    <tr>*/}
      {/*      <td>Total Discs</td>*/}
      {/*      <td>{total}</td>*/}
      {/*    </tr>*/}
      {/*    <tr>*/}
      {/*      <td> Discs In Bag</td>*/}
      {/*      <td>{totalInBag}</td>*/}
      {/*    </tr>*/}
      {/*    /!*aces*!/*/}
      {/*  </tbody>*/}
      {/*</Table>*/}
      {/*<ResponsiveContainer>*/}
      {/*  <Pie data={rows} dataKey="status" nameKey="status" label />*/}
      {/*</ResponsiveContainer>*/}
      {/*<DiscsChart discs={rows} />*/}
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
        {/*<Chip>In Bag: {totalInBag}</Chip>*/}
        {/*hi*/}
        {Object.keys(discStatuses).map((key) => (
          <Chip key={key}>
            {key}: {discStatuses[key].length}
          </Chip>
        ))}
      </Stack>
      {/*<List size={'sm'}>*/}
      {/*  <ListItem>*/}
      {/*    Total Discs: <b>{total}</b>*/}
      {/*  </ListItem>*/}
      {/*  <ListItem>*/}
      {/*    Discs In Bag: <b>{totalInBag}</b>*/}
      {/*  </ListItem>*/}
      {/*</List>*/}
      <Table>
        {/*<thead>*/}
        {/*  <tr>*/}
        {/*    <th style={{ width: '40%' }}>Dessert (100g serving)</th>*/}
        {/*    <th>Calories</th>*/}
        {/*    <th>Fat&nbsp;(g)</th>*/}
        {/*    <th>Carbs&nbsp;(g)</th>*/}
        {/*    <th>Protein&nbsp;(g)</th>*/}
        {/*  </tr>*/}
        {/*</thead>*/}
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Color</th>
            <th>Disc</th>
            {/*<th>Model</th>*/}
            <th>Weight</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((disc) => (
            <tr key={disc.id}>
              <td>{disc.id}</td>
              <td>{disc.created?.toLocaleDateString()}</td>
              <td>{disc.color}</td>
              <td>
                {disc.brand}
                <br />
                {disc.model}
              </td>
              {/*<td>{disc.model}</td>*/}
              <td>{disc.weight ? `${disc.weight}g` : ''}</td>
              <td>{disc.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
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
  // return (
  //   <main>
  //     <Navigation />
  //     <h1>Disc Database</h1>
  //     <iframe
  //       className="nc-embed"
  //       src="https://noco.lkat.io/dashboard/#/nc/view/19588d47-7626-443a-a182-2a9c10059421?embed"
  //       frameBorder="0"
  //       width="100%"
  //       height="700"
  //       // style="background: transparent; border: 1px solid #ddd"
  //       style={{ background: 'transparent', border: '1px solid #ddd' }}
  //     ></iframe>
  //   </main>
  // );
}
