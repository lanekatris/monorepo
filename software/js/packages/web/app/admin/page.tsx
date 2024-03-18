import {
  Alert,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Typography,
} from '@mui/joy';
import { redirect } from 'next/navigation';
import { isAdmin } from 'packages/web/isAdmin';

export default async function AdminPage() {
  async function kickObsidianAdventureSync() {
    'use server';
    const url = `http://${process.env.SERVER1_URL}/obsidian-adventure-sync`;
    console.log('calling ' + url);
    await fetch(url, { cache: 'no-store' });
    redirect(`/`);
  }

  if (!isAdmin()) return <Alert color="danger">Not Authorized</Alert>;

  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Admin Dashboard:</Typography>
      </Breadcrumbs>
      <form action={kickObsidianAdventureSync}>
        <Button type="submit">Kick Obsidian Adventure Sync</Button>
      </form>
    </Container>
  );
}
