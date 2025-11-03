MODEL (
    name models.obsidian_tags,
    cron '@daily'
);

with x as (
    select  jsonb_array_elements(meta -> 'Tags')::text tag,
        case
            when file_date <> '' then file_date::date
    else null
end as                    file_date
    from markdown_file_models where meta ->> 'Tags' is not null
)
-- select trim('"' from tag) tag,count(*) count,min(file_date) min_date, max(file_date) max_date from x group by tag
select file_date,  trim('"' from tag) tag from x
-- debug
-- where file_date is not null
-- order by file_date desc



-- grant select on all tables in schema models to web_anon
-- ;ALTER DEFAULT PRIVILEGES FOR USER web_anon IN SCHEMA models GRANT SELECT ON TABLES TO web_anon;