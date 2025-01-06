package shared

import (
	"time"
)

func IsWithin24Hours(target time.Time) bool {
	now := time.Now()
	duration := target.Sub(now)
	return duration >= -24*time.Hour //&& duration <= 24*time.Hour
}
