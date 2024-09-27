import {
  Alert,
  Breadcrumbs,
  Button,
  Container,
  Input,
  Typography
} from '@mui/joy';
import LocationsList from './LocationsList';
import Link from 'next/link';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';
import React from 'react';

import { NotAuthorized } from '../../(blog)/feed/notAuthorized';

export interface LocationCustom {
  Address: string;
  Name: string;
}

export default async function LocationHistoryPage({
  searchParams
}: {
  searchParams: { query?: string };
}) {
  // @ts-ignore
  const query = (searchParams?.query || 'colorado').toLowerCase();

  const searchTerm = `%${query}%`;

  const { rows }: { rows: LocationCustom[] } =
    await sql`select "Address", "Name" from kestra.location_history where lower("Address") like ${searchTerm} or lower("Name") like ${searchTerm}  limit 100`;

  const session = await getServerSession();
  if (!session) return <NotAuthorized />;
  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/software/web/public">
          Home
        </Link>
        <Typography>Your Location History</Typography>
      </Breadcrumbs>
      <Typography level="h4" gutterBottom>
        Your Location History
      </Typography>
      <form style={{ marginBottom: '1.5em' }}>
        <Input
          sx={{ '--Input-decoratorChildHeight': '45px' }}
          autoFocus
          name="query"
          type="search"
          size="lg"
          placeholder="Do Me"
          defaultValue={query}
          endDecorator={<Button type="submit">Search</Button>}
        />
      </form>
      <Typography level="body-md">Results ({rows.length})</Typography>
      <LocationsList locations={rows} />
    </Container>
  );
}
