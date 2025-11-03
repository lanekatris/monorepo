MODEL (
  name models.gym_people
);

select
    distinct (v ->> 'date')::DATE date, v->>'name' person
from events e,
     jsonb_array_elements(e.data::jsonb -> 'records') v
where event_name='rhinofit_worker_v1'

