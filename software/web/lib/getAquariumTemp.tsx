import { sql } from '@vercel/postgres';

export async function getAquariumTemp(): Promise<{
  temperatureF: number;
  lastUpdated: Date;
}> {
  const { rows }: { rows: { temp: number; created_at: Date }[] } =
    await sql`select created_at at time zone 'EST' created_at, data::jsonb -> 'temperatureF' temp from events where event_name = 'aquarium_temperature_v1' order by created_at desc limit 1`;

  if (!rows.length) return { temperatureF: 0, lastUpdated: new Date() };

  const { temp, created_at } = rows[0];
  return {
    temperatureF: temp,
    lastUpdated: created_at
  };
}
