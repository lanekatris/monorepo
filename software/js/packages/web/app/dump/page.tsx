import { sql } from '@vercel/postgres';
import { Alert, Container, Typography } from '@mui/joy';
import Markdown from 'react-markdown';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function DumpPage() {
  noStore();
  const { rows }: { rows: { data: string }[] } =
    await sql`select data from temp.dump order by id desc limit 1`;

  const data = rows[0].data;

  return (
    <Container maxWidth="sm">
      <Alert color="primary">You are on dad's page</Alert>
      <Markdown>{data}</Markdown>
    </Container>
  );
}
