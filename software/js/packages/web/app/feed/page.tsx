import { Breadcrumbs, Container, Link, Stack, Typography } from '@mui/joy';
import { getFeed } from '../../feed/get-feed';
import { FeedTable } from '../FeedTable';
import React from 'react';
import NextLink from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

interface FeedPageProps {
  searchParams: {
    showBookmarks?: 'true' | 'false';
  };
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  noStore();
  const feedFilter = {
    showBookmarks: searchParams.showBookmarks !== 'false',
  };

  const feed = await getFeed(feedFilter);

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between">
        <Breadcrumbs>
          <Link color="neutral" href="/">
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
