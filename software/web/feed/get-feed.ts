import { cache } from 'react';
import { sql } from '@vercel/postgres';

// import bookmarks from '../app/search/raindrop-export.json';
import { Raindrop } from './raindrop';
import { getFromMinio } from './get-from-minio';
import { FeedItem, Memo } from './feed-types';
import axios from 'axios';

async function getFeedItems() {
  console.time('sql');
  const { rows: feed }: { rows: FeedItem[] } = await sql`
  with x as (select concat('climb-', id) id, 'climb' type, "Date"::date date, json_build_object('climb', t.*) data
           from kestra.ticks t
           union all
           select concat('scorecard-', u.id)          id,
                  'scorecard'                         type,
                  "startdate"::date                   date,
                  json_build_object('scorecard', u.*) data
           from kestra.udisc_scorecard u
           union all
           select concat('disc-', d.id)                   id,
                  'disc'                                  type,
                  coalesce(d.created, d.created_at)::date date,
                  json_build_object('disc', d.*)          data
           from noco.disc d
           union all
           select concat('adventure-', a.id)        id,
                  'obsidian-adventure'              type,
                  a.file_date::date                 date,
                  json_build_object('adventure', json_build_object(
                          'id', a.id,
                          'created_at', a.created_at,
                          'updated_at', a.updated_at,
                          'deleted_at', a.deleted_at,
                          'date', a.file_date,
                          'activity',
                          replace(replace(file_path, concat(split_part(file_path, ' ', 1), ' '), ''), '.md', ''),-- this is the reason we manually build out this object instead of a.*
                          'contents', a.file_contents,
                          'tags', a.meta -> 'Tags',
                          'path', a.file_path
                                                 )) data
           from public.markdown_file_models a
           where a.file_path like 'Adventures%'
           union all
           select concat('purchase-', p.id)          id,
                  'purchase'                         type,
                  p."Date"::date                     date,
                  json_build_object('purchase', p.*) data
           from noco.purchases p
           union all
           select concat('maintenance-', m.id)          id,
                  'maintenance'                         type,
                  m."Date"::date                        date,
                  json_build_object('maintenance', m.*) data
           from noco.maintenance m)
select *
from x
order by date desc

  `;
  console.timeEnd('sql');
  return feed;
}

export async function getPicMemos() {
  const { data: rawMemos } = await axios.get<{ memos: Memo[] }>(
    'http://192.168.86.100:5230/api/v1/memos?filter=tag_search == ["pic"]',
    {
      headers: {
        authorization: `Bearer ${process.env.MEMOS_API_KEY}`
      }
    }
  );

  return rawMemos.memos;
}

export async function getMemos() {
  console.time('memos');
  const { data: rawMemos } = await axios.get<{ memos: Memo[] }>(
    'http://192.168.86.100:5230/api/v1/memos',
    {
      headers: {
        authorization: `Bearer ${process.env.MEMOS_API_KEY}`
      }
    }
  );
  // console.log(rawMemos);
  // const rawMemos: Memo[] = await memosResponse.data;
  const memos: Memo[] = rawMemos.memos.map((x) => ({
    ...x,
    _date: new Date(x.displayTime) //new Date(x.displayTs * 1000),
  }));
  console.timeEnd('memos');
  return memos.map((memo) => {
    const b: FeedItem = {
      id: `memo-${memo.uid}`,
      type: 'memo',
      date: memo._date,
      data: {
        memo: memo
      }
    };
    return b;
  });
}

export async function getRaindrops() {
  console.time('raindrops');

  const raindrops: Raindrop[] = await getFromMinio('etl', 'raindrops.json');

  console.timeEnd('raindrops');
  return raindrops.map((raindrop) => {
    const r: FeedItem = {
      id: raindrop._id.toString(),
      type: 'raindrop',
      date: new Date(raindrop.lastUpdate),
      data: {
        raindrop: raindrop
      }
    };
    return r;
  });
}

export const getFeed = async ({
  showBookmarks = true
}: { showBookmarks?: boolean } | undefined = {}) => {
  console.log('aaa', showBookmarks);
  const allData = await Promise.all([
    // getRaindrops(),
    showBookmarks ? getRaindrops() : Promise.resolve([]),
    getFeedItems(),
    getMemos()
  ]);

  console.time('agg');

  const finalFeed = allData.flatMap((x) => x);

  finalFeed.sort((a, b) => {
    if (!b.date || !a.date) {
      throw new Error(
        'Date is null: ' +
          JSON.stringify(a) +
          ' 🤺🤺🤺🤺🤺 ' +
          JSON.stringify(b)
      );
    }
    return b.date.valueOf() - a.date.valueOf();
  });
  console.timeEnd('agg');

  return finalFeed;
  // return finalFeed.slice(0, 100);
};
