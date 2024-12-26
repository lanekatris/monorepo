import {
  Alert,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  Container,
  Link,
  List,
  ListItem,
  ListItemContent,
  Typography
} from '@mui/joy';
import { sql } from '@vercel/postgres';
import { useMemo } from 'react';
import { differenceInDays, formatRelative } from 'date-fns';
import FitnessChart from './ChartIdk';

import SimpleCalendar from '../../SimpleCalendar';

interface FitnessRecord {
  id: number;
  file_relative_path: string;
  date: Date; // Assuming the date is represented as a string in the format "2023-07-17T04:00:00.000Z"
  week_start: Date; // Assuming the date is represented as a string in the format "2023-07-16T04:00:00.000Z"
  activity: string;
}

// export const revalidate = 3600; // revalidate the data at most every hour

function getLastSunday(d: Date) {
  const t = new Date(d);
  t.setDate(t.getDate() - t.getDay());
  return t;
}

export default async function FitnessPage() {
  const { rows }: { rows: FitnessRecord[] } =
    await sql`select * from noco."Test_Obsidian_Fitness" order by date desc limit 500`;

  const { rows: eyeDates }: { rows: { dd: Date }[] } = await sql`
      select dd::date
from generate_series('2024-09-19', current_date - 1, '1 day'::interval) dd
         left join vw_markdown_files m on m.file_date::date = dd.dd::date
where m.is_journal = true and meta -> 'Tags' @> '"glaucoma-eye-drops"' order by dd
  `;

  const { rows: eyeDropData }: { rows: { count: number }[] } = await sql`
      WITH date_series AS (
    SELECT dd::date
    FROM generate_series('2024-09-19', current_date - 1, '1 day'::interval) dd
),
eye_drops_data AS (
    SELECT
        ds.dd,
        m.meta -> 'Tags' @> '"glaucoma-eye-drops"' AS took_eye_drops
    FROM date_series ds
    LEFT JOIN vw_markdown_files m
        ON m.file_date::date = ds.dd
    WHERE m.is_journal = TRUE
),
ranked_data AS (
    SELECT
        dd,
        took_eye_drops,
        ROW_NUMBER() OVER (ORDER BY dd) AS overall_row,
        ROW_NUMBER() OVER (PARTITION BY took_eye_drops ORDER BY dd) AS partitioned_row,
        ROW_NUMBER() OVER (ORDER BY dd) - ROW_NUMBER() OVER (PARTITION BY took_eye_drops ORDER BY dd) AS nn
    FROM eye_drops_data
),
final_data AS (
    SELECT *,
           DENSE_RANK() OVER (ORDER BY nn) AS rank_group
    FROM ranked_data
)
SELECT COUNT(*)
FROM final_data
WHERE rank_group = (SELECT rank_group FROM final_data ORDER BY dd DESC LIMIT 1);
  `;
  // console.log(rows);
  // console.log(rows[0], rows[1]);

  const groupedData: { [key: string]: FitnessRecord[] } = rows.reduce(
    (result, entry) => {
      const weekStart = entry.week_start.toISOString().split('T')[0];
      // @ts-ignore
      if (!result[weekStart]) {
        // @ts-ignore
        result[weekStart] = [];
      }
      // @ts-ignore
      result[weekStart].push(entry);
      return result;
    },
    {}
  );

  const keys = Object.keys(groupedData);

  keys.sort().reverse();

  const chartKeys = Object.keys(groupedData).sort();
  const chartData = chartKeys.map((key) => ({
    date: key,
    blah: groupedData[key].length
  }));

  // const idk = differenceInDays(new Date(2024, 3, 22, 0, 0, 0, 0), new Date()); //formatRelative(new Date(2024, 3, 22, 0, 0, 0, 0), new Date());

  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/software/web/public">
          Home
        </Link>
        <Typography>Fitness Dashboard</Typography>
      </Breadcrumbs>
      <Typography level="h4">Fitness Dashboard</Typography>
      <Card>
        <CardContent>
          <FitnessChart chartData={chartData} />
        </CardContent>
      </Card>
      <br />
      {/*<Card>*/}
      {/*  <CardContent>*/}
      {/*    <Typography level="h4">Snowboarding Goal</Typography>*/}
      {/*    <Typography level="body-sm">*/}
      {/*      Complete 54 leg workouts to complete this goal*/}
      {/*    </Typography>*/}
      {/*    {idk} Days to Go*/}
      {/*    <Alert color="danger">0 Completed workouts for this goal</Alert>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      {/*<br />*/}
      <Typography level={'body-lg'}>
        Glaucoma Eye Drop Streak: <b>{eyeDropData[0]?.count}</b>
      </Typography>
      <SimpleCalendar dates={eyeDates.map((x) => x.dd)} />
      <br />
      <Card>
        <CardContent>
          <Typography level="h4">Log</Typography>
          Today: {new Date().toLocaleDateString('en-CA')}
          <br />
          Week Start: {getLastSunday(new Date()).toLocaleDateString('en-CA')}
          <List>
            {keys.map((key) => (
              <ListItem key={key}>
                <List>
                  <Typography level="title-md">
                    {key} ({groupedData[key].length})
                    {key ===
                    getLastSunday(new Date()).toLocaleDateString('en-CA') ? (
                      <Chip color="primary">This Week</Chip>
                    ) : null}
                  </Typography>
                  {groupedData[key].map((row) => (
                    <ListItem key={row.id} sx={{ backgroundColor: '#ffffce' }}>
                      <ListItemContent>
                        <Typography level="body-sm">
                          {row.date.toLocaleDateString('en-CA')} -{' '}
                          {row.file_relative_path} - {row.activity}
                        </Typography>
                      </ListItemContent>
                    </ListItem>
                  ))}
                </List>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
}
