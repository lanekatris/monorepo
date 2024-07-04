import {
  Breadcrumbs,
  Container,
  Link,
  Sheet,
  Table,
  Typography,
} from '@mui/joy';
import { sql } from '@vercel/postgres';
import { RawUdiscScorecardEntry } from 'packages/scorecards/src/raw-udisc-scorecard-entry';
import { DiscGolfRoundRow } from './discGolfRoundRow';

// export interface DiscGolfRo
export const dynamic = 'force-dynamic';
export default async function DiscGolfRounds() {
  const { rows }: { rows: RawUdiscScorecardEntry[] } =
    await sql`select * from kestra.udisc_scorecard where playername = 'Lane' order by startdate desc`;

  return (
    <Container maxWidth="md">
      {/*<br />*/}
      <Breadcrumbs aria-label="breadcrumbs">
        {/*{['Home', 'TV Shows', 'Futurama', 'Characters'].map((item: string) => (*/}
        {/*  <Link key={item} color="neutral" href="#basics">*/}
        {/*    {item}*/}
        {/*  </Link>*/}
        {/*))}*/}
        <Link href="/">Home</Link>
        <Link href="/discs">DG Discs</Link>
        <Typography>DG Rounds</Typography>
      </Breadcrumbs>
      <Typography level="h2" sx={{ textAlign: 'center' }}>
        Lane&apos;s Udisc Disc Golf Rounds ({rows.length})
      </Typography>
      <Sheet sx={{ overflow: 'auto' }}>
        <Table stripe="odd">
          <caption>
            Rating is out of 300. Udisc doesn&apos;t export a link to their
            courses in their CSV.
          </caption>
          <thead>
            <tr>
              <th />
              <th style={{ width: 100 }}>Date</th>
              <th style={{ width: 300 }}>Course</th>

              <th style={{ width: 250 }}>Layout</th>
              <th style={{ width: 70 }}>Score</th>
              <th style={{ width: 70 }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => {
              return <DiscGolfRoundRow x={x} />;
              // return (
              //   <tr key={x.startdate + x.coursename}>
              //     <td>{x.startdate.toLocaleDateString()}</td>
              //     <td>{x.coursename}</td>
              //
              //     <td>{x.layoutname}</td>
              //     <td style={{ color: x['+/-'] >= 0 ? 'red' : 'green' }}>
              //       {x['+/-'] === 0 ? 'E' : x['+/-']} ({x.total})
              //     </td>
              //     <td>{x.roundrating}</td>
              //   </tr>
              // );
            })}
          </tbody>
        </Table>
      </Sheet>

      {/*<Stack gap={1}>*/}
      {/*  {rows.map((x) => (*/}
      {/*    <Card key={x.startdate + x.coursename} size="sm">*/}
      {/*      /!*<CardContent>{x.coursename}</CardContent>*!/*/}
      {/*      <Stack direction="row" justifyContent="space-between">*/}
      {/*        <Typography>{x.coursename}</Typography>*/}
      {/*        <Typography>{x.roundrating}</Typography>*/}
      {/*      </Stack>*/}
      {/*      <Typography>{x.layoutname}</Typography>*/}
      {/*      <Typography>{x.startdate.toLocaleDateString()}</Typography>*/}
      {/*      <Typography>{x.playername}</Typography>*/}
      {/*      <Typography>*/}
      {/*        {x['+/-'] === 0 ? 'E' : x['+/-']} ({x.total})*/}
      {/*      </Typography>*/}
      {/*    </Card>*/}
      {/*  ))}*/}
      {/*</Stack>*/}
    </Container>
  );
}
