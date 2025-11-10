MODEL (
  name models.twitch_stream
);

select created_at, data::jsonb->'user_name' from events where event_name='twitch_stream_online_v1' order by created_at desc
