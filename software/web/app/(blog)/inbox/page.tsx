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
where folder_depth = 1;`;

  const summersvilleWaterHight: { rows: { count: number }[] } =
    await sql`select data::jsonb->'sug'->'pool_cur'->'elev' count from events where event_name = 'climbrest_build_kicked' order by created_at desc limit 1`;

  const waterHeight = summersvilleWaterHight.rows[0]?.count;
  const canClimb = waterHeight <= 1620;

  // lets get the barcode query
  //
  const { rows: barcodes }: { rows: { has_unknown_barcodes: boolean }[] } =
    await sql`select EXISTS(select 1 from events e
    left join noco.grocery ng on ng.barcode = data::jsonb ->> 'barcode'
    where event_name = 'barcode_scanned_v1' and data::jsonb ->> 'barcode' != 'abc123'
        and ng.name is null) has_unknown_barcodes`;
  const hasUnknownBarcodes = barcodes[0]?.has_unknown_barcodes;

  return (
    <div>
      {/* <div className={'flash danger'}> */}
      {/*   <b>You Don&apos;t Have Something Planned!</b> */}
      {/*   <div>Ideas: {NEXT_ADVENTURE}</div> */}
      {/* </div> */}

      {hasUnknownBarcodes && (
        <div className="flash danger">
          You have unknown barcodes. <Link href="/food">Fix</Link>
        </div>
      )}
      {!hasUnknownBarcodes && (
        <div className="flash success">All barcodes are processed.</div>
      )}

      {rootFolderCounts.rows[0]?.count > 50 && (
        <div className={'flash danger'}>
          Your obsidian vault is a bit cluttered. There are{' '}
          {rootFolderCounts.rows[0]?.count} files at <code>/</code> when you
          want at most 50
        </div>
      )}
      {rootFolderCounts.rows[0]?.count <= 50 && (
        <div className={'flash success'}>
          Your obsidian root looks tidy ({rootFolderCounts.rows[0]?.count})
        </div>
      )}
      <div className={`flash ${canClimb ? 'success' : 'error'}`}>
        Can climb at Summersville {waterHeight} / 1620
      </div>
      <a href="https://miniflux.lkat.io/feeds">Miniflux</a>
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
