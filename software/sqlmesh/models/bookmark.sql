MODEL (
    name models.bookmark
      );

with x as (
    select created_at, data::jsonb data from events where event_name = 'bookmark_v1'
)
, y as (

select (data ->> '_id')::bigint id, created_at updated, data->> 'link' link, data->> 'title' title, (xx.data->>'collectionId')::int collection_id
from x xx
)
select yy.*, rc.name collection_name from y yy
left join models.raindrop_collection rc on rc.id = yy.collection_id