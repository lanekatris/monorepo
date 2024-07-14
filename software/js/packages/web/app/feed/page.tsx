import {
  Breadcrumbs,
  Container,
  Link,
  Stack,
  Switch,
  Typography,
} from '@mui/joy';
import { getFeed } from '../../feed/get-feed';
import { FeedTable } from '../../app/Idk';
import React from 'react';
import NextLink from 'next/link';

export const dynamic = 'force-dynamic';

interface FeedPageProps {
  searchParams: {
    showBookmarks?: 'true' | 'false';
  };
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const feedFilter = {
    showBookmarks: searchParams.showBookmarks !== 'false',
  };

  const feed = await getFeed(feedFilter);

  console.log('searchparams', searchParams);

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
        {/*<Link href="/admin">Refresh Feed...</Link>*/}
        <NextLink
          href={`/feed?showBookmarks=${
            feedFilter.showBookmarks ? 'false' : 'true'
          }`}
        >
          {feedFilter.showBookmarks ? 'Hide Bookmarks' : 'Show Bookmarks'}
        </NextLink>
      </Stack>

      {/*<Switch checked={feedFilter.showBookmarks} />*/}
      {/*<Typography*/}
      {/*  component="label"*/}
      {/*  endDecorator={*/}
      {/*    <Switch sx={{ ml: 1 }} checked={feedFilter.showBookmarks} onChange={e=> } />*/}
      {/*  }*/}
      {/*>*/}
      {/*  Show Bookmarks*/}
      {/*</Typography>*/}

      <FeedTable rows={feed} />
    </Container>
  );
}
