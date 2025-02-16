MODEL (
    name models.obsidian_tags,
    cron '@daily'
);

with x as (
    select distinct jsonb_array_elements(meta -> 'Tags')::text tag from markdown_file_models where meta ->> 'Tags' is not null
)
select trim('"' from tag) tag from x