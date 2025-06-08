-- name: HasTakenVitaminsToday :one
select count(*) from models.obsidian_tags where tag = $1 and max_date = now();