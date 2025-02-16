MODEL (
    name models.body_weight,
    cron '@daily'
);

-- https://popsql.com/learn-sql/postgresql/how-to-query-a-json-column-in-postgresql
with x as (
    select file_date::date, (meta ->> 'Weight')::float weight from markdown_file_models
)
select * from x where weight > 0