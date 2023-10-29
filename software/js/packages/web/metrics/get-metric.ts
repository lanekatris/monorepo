import { cache } from 'react';
import { Client } from 'pg';

export interface Result {
  visited: boolean;
  count: string;
}

export const revalidate = 3600; // revalidate teh data at most every hour

export const getMetric = cache(async (sql: string) => {
  const client = new Client({
    ssl: true,
    connectionString: process.env.POSTGRES_CONN_URL,
  });
  await client.connect();

  const { rows }: { rows: Result[] } = await client.query(sql);

  await client.end();

  const total = rows.reduce((acc, cur) => acc + Number(cur.count), 0);
  const completed = rows
    .filter((x) => x.visited)
    .reduce((acc, cur) => acc + Number(cur.count), 0);

  const percentage = Math.floor((completed / total) * 100);

  return {
    completed,
    total,
    percentage,
  };
});
