import { cache } from 'react';
import { sql } from '@vercel/postgres';

export const revalidate = 3600; // revalidate teh data at most every hour

export const getFeed = cache(async () => {
  console.log('Loading feed...');
  const {
    rows: feed,
  }: {
    rows: {
      id: string;
      type:
        | 'disc-golf-scorecard'
        | 'climb'
        | 'disc-golf-disc'
        | 'obsidian-adventure';
      date: Date;
      data: {
        climb?: { Route: string; Rating: string };
        scorecard?: { coursename: string; '+/-': number };
        disc?: {
          brand: string;
          model: string;
          plastic: string;
          number: number;
          weight?: number;
        };
        adventure?: { activity: string };
      };
    }[];
  } = await sql`
with x as (select
 case
                   when f.type = 'climb' then concat('climb-', t.id)
                  when f.type = 'disc-golf-scorecard' then concat('scorecard-', u.id)
     when f.type = 'disc-golf-disc' then concat('disc-',d.id)
     when f.type = 'obsidian-adventure' then concat('obsidian-adventure-', oa.id)
                end as id,
f.type,
                  case
                      when f.type = 'climb' then t."Date"::date
                      when f.type = 'disc-golf-scorecard' then u."date"::date
                      when f.type = 'disc-golf-disc' then coalesce(d.created, d.created_at)::date
                      when f.type = 'obsidian-adventure' then oa.date::date
                      end as date,
                  json_build_object(
                          'climb', t.*,
                          'scorecard', u.*,
                            'disc', d.*,
                            'adventure', oa.*
                      )   as data
           from noco.feed f
                    left join kestra.ticks t on f.remote_id_int = t.id and f.type = 'climb'
                    left join kestra.udisc_scorecard u on f.remote_id_int = u.id and f.type = 'disc-golf-scorecard'
                    left join noco.disc d on f.remote_id_int = d.id and f.type = 'disc-golf-disc'
                    left join kestra.obsidian_adventures oa on f.remote_id_int = oa.id and f.type = 'obsidian-adventure'
)
select * from x order by date desc;
  `;

  return feed;
});
