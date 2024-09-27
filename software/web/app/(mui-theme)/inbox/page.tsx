import {
  Alert,
  Breadcrumbs,
  Card,
  CardContent,
  Container,
  Link,
  List,
  ListItem,
  Typography
} from '@mui/joy';
import { NEXT_ADVENTURE } from '../../../nextAdventure';
import { sql } from '@vercel/postgres';
import { getRaindrops } from '../../../feed/get-feed';
import { getServerSession } from 'next-auth';
import React from 'react';
import { NotAuthorized } from '../../(blog)/feed/notAuthorized';
// import ReportIcon from '@mui/icons-material/Report';

const RAINDROP_INBOX_COLLECTION_ID = 36282268;

interface MinifluxFavorite {
  id: number;
  title: string;
}

export default async function InboxPage() {
  const { rows }: { rows: MinifluxFavorite[] } =
    await sql`select * from miniflux_favorite`;

  const allBookmarks = await getRaindrops();
  const filteredBookmarks = allBookmarks.filter(
    (x) => x.data.raindrop?.collectionId === RAINDROP_INBOX_COLLECTION_ID
  );
  const session = await getServerSession();
  if (!session) return <NotAuthorized />;
  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/software/web/public">
          Home
        </Link>
        <Typography>Your To Dos</Typography>
      </Breadcrumbs>
      <Alert color="danger">
        <b>You Don&apos;t Have Something Planned!</b>

        <Typography>Ideas: {NEXT_ADVENTURE}</Typography>
      </Alert>
      <Typography level={'h1'}>Starred RSS Entries ({rows.length})</Typography>
      <List marker={'decimal'}>
        {rows.map(({ id, title }) => (
          <ListItem key={id}>
            <Link
              target={'_blank'}
              href={`https://miniflux.lkat.io/starred/entry/${id}`}
            >
              {title}
            </Link>
          </ListItem>
        ))}
      </List>
      <Typography level={'h1'}>
        Raindrop Inbox ({filteredBookmarks.length})
      </Typography>
      <List marker={'decimal'}>
        {filteredBookmarks.map((bookmark) => (
          <ListItem key={bookmark.id}>
            <Link target={'_blank'} href={bookmark.data?.raindrop?.link}>
              {bookmark.data?.raindrop?.title}
            </Link>
          </ListItem>
        ))}
      </List>
      {/*{rows.map(({ id, title }) => (*/}
      {/*  <Card key={id}>*/}
      {/*    <CardContent>{title}</CardContent>*/}
      {/*  </Card>*/}
      {/*))}*/}
    </Container>
  );
}
