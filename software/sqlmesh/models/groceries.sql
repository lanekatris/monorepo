
MODEL (
    name models.groceries
      );




with x as (select cast(data::jsonb ->> 'eventId' as integer) event_id
           from events
           where event_name = 'groceries_cleared_v1'
           order by created_at desc
    limit 1)

select e.id, e.created_at at time zone 'EST' created_at, data::jsonb->'barcode' barcode, ng.name, xx.event_id last_purchased_id, e.id > xx.event_id as in_cart,ng.name is not null known_grocery
from events e
         left join noco.grocery ng on ng.barcode = data::jsonb->>'barcode'
cross join x xx
where event_name = 'barcode_scanned_v1'
  and data ::jsonb->>'barcode' != 'abc123'
order by id desc