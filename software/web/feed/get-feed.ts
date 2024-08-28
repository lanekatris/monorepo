import { cache } from 'react';
import { sql } from '@vercel/postgres';

// import bookmarks from '../app/search/raindrop-export.json';
import { Raindrop } from './raindrop';
import { getJsonFromMinio } from './get-json-from-minio';
import { FeedItem, Memo } from './feed-types';
import axios from 'axios';

async function getFeedItems() {
  console.time('sql');
  const { rows: feed }: { rows: FeedItem[] } = await sql`
with x as (select case
                      when f.type = 'climb' then concat('climb-', t.id)
                      when f.type = 'disc-golf-scorecard' then concat('scorecard-', u.id)
                      when f.type = 'disc-golf-disc' then concat('disc-', d.id)
                      when f.type = 'obsidian-adventure' then concat('obsidian-adventure-', oa.id)
                      when f.type = 'maintenance' then concat('maintenance-', m.id)
                      when f.type = 'purchase' then concat('purchase-', p.id)
                      end as id,
                  f.type,
                  case
                      when f.type = 'climb' then t."Date"::date
                      when f.type = 'disc-golf-scorecard' then u."startdate"::date
                      when f.type = 'disc-golf-disc' then coalesce(d.created, d.created_at)::date
                      when f.type = 'obsidian-adventure' then oa.date::date
                      when f.type = 'maintenance' then m."Date"::date
                      when f.type = 'purchase' then p."Date"
                      end as date,
                  json_build_object(
                          'climb', t.*,
                          'scorecard', u.*,
                          'disc', d.*,
                          'adventure', oa.*,
                          'maintenance', m.*,
                          'purchase', p.*
                  )       as data
           from noco.feed f
                    left join kestra.ticks t on f.remote_id_int = t.id and f.type = 'climb'
                    left join kestra.udisc_scorecard u on f.remote_id_int = u.id and f.type = 'disc-golf-scorecard'
                    left join noco.disc d on f.remote_id_int = d.id and f.type = 'disc-golf-disc'
                    left join kestra.obsidian_adventures oa on f.remote_id_int = oa.id and f.type = 'obsidian-adventure'
                    left join noco.purchases p on f.remote_id_int = p.id and f.type = 'purchase'
                    left join noco.maintenance m on f.remote_id_int = m.id and f.type = 'maintenance')
select *
from x
order by date desc;
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

async function getRaindrops() {
  console.time('raindrops');

  const raindrops: Raindrop[] = await getJsonFromMinio('etl', 'raindrops.json');

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

  return finalFeed.slice(0, 100);
};
