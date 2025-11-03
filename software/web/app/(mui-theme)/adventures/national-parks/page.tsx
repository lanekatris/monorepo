import { sql } from '../../../../lib/db';
import { getMetric } from '../../../../metrics/get-metric';
import {
  Breadcrumbs,
  Container,
  Link,
  Sheet,
  Table,
  Typography
} from '@mui/joy';
import { MetricCard } from '../../../../metrics/MetricCard';
import React from 'react';

export default async function NationalParksPage() {
  const { rows }: { rows: { id: number; name: string; visited: boolean }[] } =
    await sql`select p.id, p.name, pv.id is not null visited from temp.place  p
         left join temp.place_visit pv on p.friendly_id = pv.place_friendly_id
         where national_park=true
order by pv.id, p.name

`;

  const nationalParks = await getMetric(sql`
select pv.id is not null as visited, count(*) as count from temp.place  p
         left join temp.place_visit pv on p.friendly_id = pv.place_friendly_id
         where national_park=true
group by pv.id is not null
`);

  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/software/web/public">
          Home
        </Link>
        <Typography fontWeight="bold">National Parks </Typography>
      </Breadcrumbs>
      <MetricCard
        percentage={nationalParks.percentage}
        completed={nationalParks.completed}
        total={nationalParks.total}
        title="National Parks Visited"
      />

      <Sheet>
        <Table aria-label="striped table" stripe="odd">
          <thead>
            <tr>
              <th style={{ width: '80%' }}>Name</th>
              <th>Visited</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.visited ? '✅' : undefined}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Container>
  );
}
