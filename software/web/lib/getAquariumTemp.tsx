import { sql } from '@vercel/postgres';

export async function getAquariumTemp() {
  const { rows }: { rows: { data: string; created_at: Date }[] } =
    await sql`select * from events where event_name = 'aquarium_temperature_v1' order by created_at desc limit 1`;

  if (!rows.length) return { temperatureF: 0, lastUpdated: new Date() };

  const { temperatureF }: { temperatureF: number } = JSON.parse(rows[0].data);

  return { temperatureF, lastUpdated: rows[0].created_at };
}
