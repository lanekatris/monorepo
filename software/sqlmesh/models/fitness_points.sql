MODEL
(
      name models.fitness_points
);

@DEF(penalty, 1);

      -- You can use sqlmesh diff with the seed csv to see the data changing
with activities as (
--     select '2025-06-25'::date as a, 'vitamins' as type, 1 as b
--     union
--     select '2025-06-25'::date, 'core', 10
--     union
--     select '2025-06-23'::date, 'gym', 50
    select jsonb_array_elements(meta -> 'Tags')::text type, case
                                                                 when file_date <> '' then file_date::date
    else null
end
as                    a, 1 b


    from markdown_file_models where meta ->> 'Tags' is not null
),
timeline as (
    select date_trunc('day', dd)::date as ddd
--     from generate_series('2020-12-01'::date, now(), '1 day') dd
--     from generate_series(now() - interval '7 day', now() - interval '1 day', '1 day') dd
        from generate_series(now() - interval '7 day', now(), '1 day') dd

),
daily_points as (
    select t.ddd, coalesce(sum(a.b), 0) as daily_total
    from timeline t
    left join activities a on t.ddd = a.a
    group by t.ddd
),
with_penalty as (
    select *,
           lag(daily_total) over (order by ddd) as prev_day_total
    from daily_points
),
adjusted as (
    select *,
           case when prev_day_total = 0 then @penalty else 0 end as penalty,
           daily_total + case when prev_day_total = 0 then @penalty else 0 end as adjusted_total
    from with_penalty
)
select *,
       sum(adjusted_total) over (order by ddd) as running_total
from adjusted;
-- order by ddd desc;