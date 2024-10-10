import {
  Alert,
  Breadcrumbs,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  Typography
} from '@mui/joy';
import { NEXT_ADVENTURE } from '../../../nextAdventure';
import { sql } from '@vercel/postgres';
import { getRaindrops } from '../../../feed/get-feed';
import { getServerSession } from 'next-auth';
import React from 'react';
import { NotAuthorized } from '../feed/notAuthorized';
import Link from 'next/link';
// import ReportIcon from '@mui/icons-material/Report';

const RAINDROP_INBOX_COLLECTION_ID = 36282268;

interface MinifluxFavorite {
  id: number;
  title: string;
}

export default async function InboxPage() {
  const session = await getServerSession();
  if (!session) return <NotAuthorized />;

  const { rows }: { rows: MinifluxFavorite[] } =
    await sql`select * from miniflux_favorite`;

  const allBookmarks = await getRaindrops();
  const filteredBookmarks = allBookmarks.filter(
    (x) => x.data.raindrop?.collectionId === RAINDROP_INBOX_COLLECTION_ID
  );

  const rootFolderCounts: { rows: { count: number }[] } =
    await sql`with x as (select length(file_path) - length(replace(file_path, '/', '')) folder_depth, * from markdown_file_models)
select count(*)::int
from x
where folder_depth = 0;`;

  // console.log('idk', idk.rows);

  return (
    <div>
      <div className={'flash danger'}>
        <b>You Don&apos;t Have Something Planned!</b>
        <div>Ideas: {NEXT_ADVENTURE}</div>
      </div>

      {rootFolderCounts.rows[0]?.count > 50 && (
        <div className={'flash danger'}>
          Your obsidian vault is a bit cluttered. There are{' '}
          {rootFolderCounts.rows[0]?.count} files at <code>/</code> when you
          want at most 50
        </div>
      )}
      <h1>Starred RSS Entries ({rows.length})</h1>
      <ol>
        {rows.map(({ id, title }) => (
          <li key={id}>
            <Link
              target={'_blank'}
              href={`https://miniflux.lkat.io/starred/entry/${id}`}
            >
              {title}
            </Link>
          </li>
        ))}
      </ol>
      <h1>Raindrop Inbox ({filteredBookmarks.length})</h1>
      <ol>
        {filteredBookmarks.map((bookmark) => (
          <li key={bookmark.id}>
            <Link target={'_blank'} href={bookmark.data?.raindrop?.link!}>
              {bookmark.data?.raindrop?.title}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
