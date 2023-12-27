import Navigation from 'packages/web/layout/navigation';
import { List, ListItem, ListItemContent, Typography } from '@mui/joy';
import { sql } from '@vercel/postgres';

interface FitnessRecord {
  id: number;
  file_relative_path: string;
  date: Date; // Assuming the date is represented as a string in the format "2023-07-17T04:00:00.000Z"
  week_start: Date; // Assuming the date is represented as a string in the format "2023-07-16T04:00:00.000Z"
  activity: string;
}

export default async function FitnessPage() {
  const { rows }: { rows: FitnessRecord[] } =
    await sql`select * from noco."Test_Obsidian_Fitness" order by date desc`;
  // console.log(rows);

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

  console.log(groupedData);

  return (
    <main>
      <Navigation />
      <Typography level={'h4'}>Fitness Dashboard</Typography>
      <List>
        {keys.map((key) => (
          <ListItem key={key}>
            <List>
              <Typography level={'title-sm'}>
                {key} ({groupedData[key].length})
              </Typography>
              {groupedData[key].map((row) => (
                <ListItem key={row.id}>
                  <ListItemContent>
                    <Typography level={'body-sm'}>
                      {row.date.toLocaleDateString()} - {row.file_relative_path}{' '}
                      - {row.activity}
                    </Typography>
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
      </List>
    </main>
  );
}
