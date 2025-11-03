import {
  Breadcrumbs,
  Container,
  Link,
  Sheet,
  Table,
  Typography
} from '@mui/joy';
import React from 'react';
import { sql } from '../../../../lib/db';
import { getMetric } from '../../../../metrics/get-metric';
import { MetricCard } from '../../../../metrics/MetricCard';

export default async function FourteenersPage() {
  const { rows }: { rows: { id: number; name: string; visited_date: Date }[] } =
    await sql`select id,name,visited_date from noco.place where source = 'Hike all 14ers in Colorado' order by visited_date,name`;

  const fourteenerStats = await getMetric(
    sql`select visited, count(*) from noco.place where source = 'Hike all 14ers in Colorado' group by visited`
  );

  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/software/web/public">
          Home
        </Link>
        <Typography fontWeight="bold">My 14ers</Typography>
      </Breadcrumbs>
      <MetricCard
        percentage={fourteenerStats.percentage}
        completed={fourteenerStats.completed}
        total={fourteenerStats.total}
        title="14er Completion Progression"
      />

      <Sheet>
        <Table aria-label="striped table" stripe="odd">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.visited_date?.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Container>
  );
}
