import {
  Breadcrumbs,
  Chip,
  Container,
  Link,
  List,
  ListItem,
  Sheet,
  Table,
  Typography,
} from '@mui/joy';
import { sql } from '@vercel/postgres';
import { RawUdiscScorecardEntry } from 'packages/scorecards/src/raw-udisc-scorecard-entry';
import { DiscGolfRoundRow } from './discGolfRoundRow';
import { ImFire } from 'react-icons/im';

export const dynamic = 'force-dynamic';

export default async function DiscGolfRounds() {
  const { rows }: { rows: RawUdiscScorecardEntry[] } = await sql`
with x as (select row_number() over (
    partition by coursename
    order by startdate
    ) = 1               new_course,
                  lag("+/-", 1) over (
                      order by startdate
                      ) previous_score,
                  *
           from kestra.udisc_scorecard
           where playername = 'Lane'
           order by startdate desc)
select previous_score < 0 and "+/-" < 0 streak, * from x
`;

  return (
    <Container maxWidth="md">
      <Breadcrumbs aria-label="breadcrumbs">
        <Link href="/">Home</Link>
        <Link href="/discs">DG Discs</Link>
        <Typography>DG Rounds</Typography>
      </Breadcrumbs>
      <Typography level="h2" sx={{ textAlign: 'center' }}>
        Lane&apos;s Udisc Disc Golf Rounds ({rows.length})
      </Typography>
      {/*<Typography fontWeight="bold">Information</Typography>*/}
      {/*<List>*/}
      {/*  <ListItem>*/}
      {/*    Rating is out of 300. Udisc doesn&apos;t export a link to their*/}
      {/*    courses in their CSV.*/}
      {/*  </ListItem>*/}
      {/*  <ListItem>*/}
      {/*    <Chip size="sm" color="success">*/}
      {/*      New*/}
      {/*    </Chip>*/}
      {/*    means this is the first time I've played this course. Keep in mind*/}
      {/*    Udisc moderators can change the coursename willy nilly.*/}
      {/*  </ListItem>*/}
      {/*  <ListItem>*/}
      {/*    <ImFire color="green" /> streak - determined if your previous round*/}
      {/*    and current round were under par.*/}
      {/*  </ListItem>*/}
      {/*</List>*/}
      <Sheet sx={{ overflow: 'auto' }}>
        <Table stripe="odd">
          <caption style={{ textAlign: 'left' }}>
            Rating is out of 300. Udisc doesn&apos;t export a link to their
            courses in their CSV.
            {/*<br />*/}
            <br />
            <Chip size="sm" color="success">
              New
            </Chip>
            means this is the first time I've played this course. Keep in mind
            Udisc moderators can change the coursename willy nilly.
            <br />
            <ImFire color="green" /> streak - determined if your previous round
            and current round were under par.
          </caption>
          <thead>
            <tr>
              {/*<th />*/}
              <th style={{ width: 100 }}>Date</th>
              <th style={{ width: 300 }}>Course</th>

              <th style={{ width: 250 }}>Layout</th>
              <th style={{ width: 90 }}>Score</th>
              <th style={{ width: 70 }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => {
              return <DiscGolfRoundRow key={x.id} x={x} />;
            })}
          </tbody>
        </Table>
      </Sheet>
    </Container>
  );
}
