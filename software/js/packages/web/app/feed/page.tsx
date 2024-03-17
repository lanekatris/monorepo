import { Breadcrumbs, Card, Container, Link, Typography } from '@mui/joy';
import { getFeed } from 'packages/web/feed/get-feed';
import { FeedTable } from 'packages/web/app/Idk';

export const dynamic = 'force-dynamic';
export default async function FeedPage() {
  const feed = await getFeed();
  // console.log('feed',feed)
  // console.log(feed)

  return (
    <Container>
      {/*<Card>*/}
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Feed ({feed.length})</Typography>
      </Breadcrumbs>
      {/*<Typography level="h4" mt="1em">*/}
      {/*  Feed ({feed.length})*/}
      {/*</Typography>*/}
      <FeedTable rows={feed} />
      {/*</Card>*/}
    </Container>
  );
}
