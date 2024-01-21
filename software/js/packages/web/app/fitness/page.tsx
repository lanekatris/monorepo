import Navigation from 'packages/web/layout/navigation';
import {
  Breadcrumbs,
  Chip,
  Container,
  Link,
  List,
  ListItem,
  ListItemContent,
  Typography,
} from '@mui/joy';
import { sql } from '@vercel/postgres';
import { useMemo } from 'react';

interface FitnessRecord {
  id: number;
  file_relative_path: string;
  date: Date; // Assuming the date is represented as a string in the format "2023-07-17T04:00:00.000Z"
  week_start: Date; // Assuming the date is represented as a string in the format "2023-07-16T04:00:00.000Z"
  activity: string;
}

// export const revalidate = 3600; // revalidate the data at most every hour

function getLastSunday(d) {
  var t = new Date(d);
  t.setDate(t.getDate() - t.getDay());
  return t;
}

export default async function FitnessPage() {
  console.log('getting fitness...');
  const { rows }: { rows: FitnessRecord[] } =
    await sql`select * from noco."Test_Obsidian_Fitness" order by date desc limit 500`;
  // console.log(rows);
  console.log(rows[0], rows[1]);

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

  console.log('keys', keys);

  return (
    <Container maxWidth={'sm'}>
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Fitness Dashboard</Typography>
      </Breadcrumbs>
      <Typography level={'h4'}>Fitness Dashboard</Typography>
      Today: {new Date().toLocaleDateString('en-CA')}
      <br />
      Week Start: {getLastSunday(new Date()).toLocaleDateString('en-CA')}
      <List>
        {keys.map((key) => (
          <ListItem key={key}>
            <List>
              <Typography level={'title-md'}>
                {key} ({groupedData[key].length})
                {key ===
                getLastSunday(new Date()).toLocaleDateString('en-CA') ? (
                  <Chip color="primary">This Week</Chip>
                ) : null}
              </Typography>
              {groupedData[key].map((row) => (
                <ListItem key={row.id} sx={{ backgroundColor: '#ffffce' }}>
                  <ListItemContent>
                    <Typography level={'body-sm'}>
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
    </Container>
  );
}
