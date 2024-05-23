import { cache } from 'react';
import { sql } from '@vercel/postgres';

import bookmarks from '../app/search/raindrop-export.json';

export interface Bookmark {
  id: string;
  title: string;
  note: string;
  excerpt: string;
  url: string;
  folder: string;
  tags: string;
  created: string;
  cover: string;
  highlights: string;
  favorite: string;
}
export interface Memo {
  id: number;
  name: string;
  rowStatus: string;
  creatorId: number;
  createdTs: number;
  updatedTs: number;
  displayTs: number;
  content: string;
  visibility: string;
  pinned: boolean;
  creatorName: string;
  creatorUsername: string;
  _date: Date;
  resourceList: {
    name: string;
    type: string;
  }[];
}

export type FeedItemType =
  | 'disc-golf-scorecard'
  | 'climb'
  | 'disc-golf-disc'
  | 'obsidian-adventure'
  | 'bookmark'
  | 'memo'
  | 'maintenance';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  date: Date;
  data: {
    climb?: { Route: string; Rating: string; Notes?: string };
    scorecard?: { coursename: string; '+/-': number };
    disc?: {
      brand: string;
      model: string;
      plastic: string;
      number: number;
      weight?: number;
    };
    adventure?: { activity: string; contents?: string };
    bookmark?: Bookmark;
    memo?: Memo;
    maintenance?: {
      title: string;
      Date: string;
      Property: string;
      Notes: string;
    };
  };
}

export const getFeed = cache(async () => {
  console.time('sql');
  const { rows: feed }: { rows: FeedItem[] } = await sql`
with x as (select
 case
                   when f.type = 'climb' then concat('climb-', t.id)
                  when f.type = 'disc-golf-scorecard' then concat('scorecard-', u.id)
     when f.type = 'disc-golf-disc' then concat('disc-',d.id)
     when f.type = 'obsidian-adventure' then concat('obsidian-adventure-', oa.id)
     when f.type = 'maintenance' then concat('maintenance-', m.id)
                end as id,
f.type,
                  case
                      when f.type = 'climb' then t."Date"::date
                      when f.type = 'disc-golf-scorecard' then u."startdate"::date
                      when f.type = 'disc-golf-disc' then coalesce(d.created, d.created_at)::date
                      when f.type = 'obsidian-adventure' then oa.date::date
                      when f.type = 'maintenance' then m."Date"::date
                      end as date,
                  json_build_object(
                          'climb', t.*,
                          'scorecard', u.*,
                            'disc', d.*,
                            'adventure', oa.*,
                            'maintenance',m.*
                      )   as data
           from noco.feed f
                    left join kestra.ticks t on f.remote_id_int = t.id and f.type = 'climb'
                    left join kestra.udisc_scorecard u on f.remote_id_int = u.id and f.type = 'disc-golf-scorecard'
                    left join noco.disc d on f.remote_id_int = d.id and f.type = 'disc-golf-disc'
                    left join kestra.obsidian_adventures oa on f.remote_id_int = oa.id and f.type = 'obsidian-adventure'
                    left join noco.maintenance m on f.remote_id_int = m.id and f.type = 'maintenance'
)
select * from x order by date desc;
  `;
  console.timeEnd('sql');

  console.time('memos');
  const memosResponse = await fetch('https://memo.lkat.io/api/v1/memo', {
    headers: {
      authorization: `Bearer ${process.env.MEMOS_API_KEY}`,
    },
  });
  const rawMemos: Memo[] = await memosResponse.json();
  const memos: Memo[] = rawMemos.map((x) => ({
    ...x,
    _date: new Date(x.displayTs * 1000),
  }));
  console.timeEnd('memos');

  console.time('agg');
  const finalFeed: FeedItem[] = [
    ...feed,
    ...memos.map((memo) => {
      const b: FeedItem = {
        id: `memo-${memo.id}`,
        type: 'memo',
        date: memo._date,
        data: {
          memo: memo,
        },
      };
      return b;
    }),
    ...bookmarks.map((bookmark) => {
      const a: FeedItem = {
        id: bookmark.id,
        type: 'bookmark',
        date: new Date(bookmark.created),
        data: {
          bookmark: bookmark,
        },
      };
      return a;
    }),
  ];
  finalFeed.sort((a, b) => {
    // return a.date - b.date;
    if (!b.date || !a.date) {
      throw new Error(
        'Date is null: ' + JSON.stringify(a) + ' --- ' + JSON.stringify(b)
      );
    }
    return b.date.valueOf() - a.date.valueOf();
  });
  console.timeEnd('agg');

  // console.log('feed', feed);
  return finalFeed.slice(0, 100);
});
