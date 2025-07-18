// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: query.sql

package dbgenerated

import (
	"context"

	"github.com/jackc/pgx/v5/pgtype"
)

const hasTakenVitaminsToday = `-- name: HasTakenVitaminsToday :one
select count(*) from models.obsidian_tags where tag = $1 and max_date = now()
`

func (q *Queries) HasTakenVitaminsToday(ctx context.Context, tag pgtype.Text) (int64, error) {
	row := q.db.QueryRow(ctx, hasTakenVitaminsToday, tag)
	var count int64
	err := row.Scan(&count)
	return count, err
}
