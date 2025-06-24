-- name: HasTakenVitaminsToday :one
select count(*) AS count from models.obsidian_tags where tag = $1 and max_date = (now() AT TIME ZONE 'EST')::date;