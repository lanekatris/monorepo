import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Stack,
  Typography
} from '@mui/joy';
import { getFeed } from '../../../feed/get-feed';
import { FeedTable } from '../FeedTable';
import React from 'react';
import NextLink from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { getServerSession } from 'next-auth';
import { SiAdblock } from 'react-icons/si';

export const dynamic = 'force-dynamic';

interface FeedPageProps {
  searchParams: {
    showBookmarks?: 'true' | 'false';
  };
}

export function NotAuthorized() {
  return (
    <Container maxWidth="sm">
      <Box textAlign="center">
        <SiAdblock fontSize={'6em'} color={'rgb(125, 18, 18)'} />
      </Box>
      <br />
      <Alert
        size={'lg'}
        color={'danger'}
        endDecorator={
          <NextLink href="/software/web/app/(mui-theme)/api/auth/signin">
            <Button size={'sm'} color={'danger'}>
              Login
            </Button>
          </NextLink>
        }
      >
        You must be logged in to access.
      </Alert>
    </Container>
  );
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  noStore();
  const feedFilter = {
    showBookmarks: searchParams.showBookmarks !== 'false'
  };

  const feed = await getFeed(feedFilter);

  const session = await getServerSession();
  if (!session) return <NotAuthorized />;

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between">
        <Breadcrumbs>
          <Link color="neutral" href="/software/web/public">
            Home
          </Link>
          <Typography>
            Feed ({feed.length}) :: <Link href="/feed.json">API</Link> ::{' '}
            <Link href="/admin">Refresh Feed...</Link>
          </Typography>
        </Breadcrumbs>
        <NextLink
          href={`/feed?showBookmarks=${
            feedFilter.showBookmarks ? 'false' : 'true'
          }`}
        >
          {feedFilter.showBookmarks ? 'Hide Bookmarks' : 'Show Bookmarks'}
        </NextLink>
      </Stack>

      <FeedTable rows={feed} />
    </Container>
  );
}
