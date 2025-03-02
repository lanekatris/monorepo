MODEL (
      name models.versions
);

with x as (select
               date_trunc('month', file_date::date)::date                                                 month_start,
                   (date_trunc('month', file_date::date)::date + interval '1 month' - interval '1 day')::date month_end
           from models.adventures
           order by file_date desc
    limit 1),
    y as (select count(*) adventure_count_for_month
from models.adventures a
    cross join x xx
where a.file_date::date between xx.month_start and xx.month_end),
    z as (select concat(to_char(created_at, 'yyyymm'), '-', data::jsonb ->> 'highlight_count') version,
    'paper_calendar'                                                              type
from public.events
where event_name = 'calendar_processed_v1'
order by created_at desc
    limit 1)

select concat(to_char(xx.month_start, 'yyyymm'), '-', yy.adventure_count_for_month) version, 'obsidian_adventures' type
from x xx
         cross join y yy
union
select *
from z