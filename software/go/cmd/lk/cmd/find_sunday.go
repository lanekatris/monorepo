package cmd

import "time"

func FindSunday(date time.Time) time.Time {
	if date.Weekday() == time.Sunday {
		return date
	}

	dayBefore := date.AddDate(0, 0, -1)

	if dayBefore.Weekday() == time.Sunday {
		return dayBefore
	}

	return FindSunday(dayBefore)

}
