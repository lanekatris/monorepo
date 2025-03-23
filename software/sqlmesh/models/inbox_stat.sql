MODEL (
    name models.inbox_stat
      );

select (data::jsonb->'unreadCount')::int unread_count from public.events
where event_name= 'inbox_data_received_v1'
  and (data::jsonb->'unreadCount')::int > 0
order by created_at desc limit 1