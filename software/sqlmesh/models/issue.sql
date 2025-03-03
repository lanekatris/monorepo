MODEL (
    name models.issue
      );

select concat('Volleyball needs scores updated for: ', opponent) message from noco.volleyball where date < now() and (sets_won is null or sets_lost is null)
union
select 'Rhinofit sync may have an issue' message where not exists (select *
                                                                   from events
                                                                   where event_name = 'rhinofit_worker_v1'
                                                                     and created_at > now() - interval '16 minutes')


union



select 'Go to the gym!' message where not exists (
    select * from models.adventures where adventure_type = 'Indoor Climbing'
                                      and file_date::date > now() - interval '7 days'
)

union

select concat('Clean up obsidian! Root file count: ', count(*)) message from models.obsidian_file where in_root having count(*) > 50

union

select 'Digital and paper adventure calendars are out of sync' message from models.versions where type in ('obsidian_adventures', 'paper_calendar') group by version having count(distinct version) > 1

-- union
--
-- select concat('Clean up emails! Count: ', data::jsonb->'unreadCount', '. Updated: ', created_at) message
-- from public.events where event_name= 'inbox_data_received_v1'
--               and (data::jsonb->'unreadCount')::int > 0
-- order by created_at desc limit 1
--

union

select concat('Clean up emails! (',unread_count,')') message from models.inbox_stat where unread_count > 0
