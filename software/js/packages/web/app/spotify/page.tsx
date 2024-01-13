import { Breadcrumbs, CardContent, Container, Typography } from '@mui/joy';
import Link from 'next/link';
import { Card } from '@tremor/react';
import { sql } from '@vercel/postgres';

interface TotalListening {
  total_milliseconds: string;
  start_date: string;
  end_date: string;
}

export default async function SpotifyPage() {
  const { rows }: { rows: TotalListening[] } =
    await sql`select sum(msplayed) total_milliseconds, min(endtime) start_date,max(endtime) end_date from spotify_streaming_history`;

  const total = rows[0];
  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Spotify Data</Typography>
      </Breadcrumbs>

      <Typography level={'h4'} gutterBottom>
        Spotify Data
      </Typography>

      <Card>
        <CardContent>
          <Typography level={'body-md'}>Total Listen Time</Typography>
          <Typography level="h2">
            {Math.round(parseInt(total.total_milliseconds) / 3600000)} Hours
          </Typography>
          <Typography level={'body-xs'}>
            {total.start_date.split(' ')[0]} - {total.end_date.split(' ')[0]}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
