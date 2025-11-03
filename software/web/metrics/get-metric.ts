import { cache } from 'react';
import { QueryResult } from '../lib/db';

export interface Result {
  visited: boolean;
  count: string;
}

export const revalidate = 3600; // revalidate teh data at most every hour

export const getMetric = cache(
  async (sqlPromise: Promise<QueryResult<Result>>) => {
    const { rows } = await sqlPromise;

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
  }
);
