import {
  Alert,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Typography,
} from '@mui/joy';
import { isAdmin } from 'packages/web/isAdmin';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export interface Url {
  id: number;
  name: string;
  url: string;
  tags: string;
  clicks: number;
}

export default async function AdminPage() {
  async function click(formData: FormData) {
    'use server';

    const id = formData.get('id');
    const url = formData.get('url');
    if (!id) throw new Error('id is required');
    if (!url || typeof url !== 'string') throw new Error('url is required');

    const { rows }: { rows: Array<{ clicks: number }> } =
      await sql`select clicks from noco.url where id = ${+id}`;

    console.log('updating clicks', +id, rows);

    await sql`update noco.url set clicks = ${
      rows[0].clicks
    } + 1 where id = ${+id}`;
    redirect(url);
  }

  const {
    rows: urls,
  }: {
    rows: Array<Url>;
  } = await sql`select * from noco.url order by clicks desc`;

  if (!isAdmin()) return <Alert color="danger">Not Authorized</Alert>;

  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Admin Dashboard</Typography>
      </Breadcrumbs>

      <ul>
        {urls.map((u) => (
          <li key={u.name}>
            <form action={click}>
              <input type="hidden" name="id" value={u.id} />
              <input type="hidden" name="url" value={u.url} />
              <Button variant="plain" type="submit">
                {u.name}
              </Button>
              {/*<Link href={u.url} target="_blank">*/}
              {/*  {u.name} ({u.tags})*/}
              {/*</Link>*/}
            </form>

            {/*<Link*/}
            {/*  href={url}*/}
            {/*  target="_blank"*/}
            {/*  // onClick={() => {*/}
            {/*  //   console.log('hi there');*/}
            {/*  // }}*/}
            {/*>*/}
            {/*  {name} ({tags})*/}
            {/*</Link>*/}
          </li>
        ))}
      </ul>
    </Container>
  );
}
