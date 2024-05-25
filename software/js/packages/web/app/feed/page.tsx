import { Breadcrumbs, Container, Link, Stack, Typography } from '@mui/joy';
import { getFeed } from '../../feed/get-feed';
import { FeedTable } from '../../app/Idk';

export const dynamic = 'force-dynamic';

export default async function FeedPage() {
  const feed = await getFeed();

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between">
        <Breadcrumbs>
          <Link color="neutral" href="/">
            Home
          </Link>
          <Typography>Feed ({feed.length})</Typography>
        </Breadcrumbs>
        <Link href="/admin">Refresh Feed...</Link>
      </Stack>

      <FeedTable rows={feed} />
    </Container>
  );
}
