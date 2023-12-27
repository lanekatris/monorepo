package shared

import (
	"testing"
	"time"
)

func TestFindSunday(t *testing.T) {
	// Test case 1: Sunday
	date1 := time.Date(2023, time.December, 17, 0, 0, 0, 0, time.UTC)
	result1 := FindSunday(date1)
	if result1 != date1 {
		t.Errorf("Expected %v but got %v", date1, result1)
	}

	// Test case 2: Monday
	date2 := time.Date(2023, time.December, 18, 0, 0, 0, 0, time.UTC)
	result2 := FindSunday(date2)
	expected2 := time.Date(2023, time.December, 17, 0, 0, 0, 0, time.UTC)
	if result2 != expected2 {
		t.Errorf("Expected %v but got %v", expected2, result2)
	}

	date3 := time.Date(2023, time.December, 29, 0, 0, 0, 0, time.UTC)
	result3 := FindSunday(date3)
	if result3.Weekday() != time.Sunday {
		t.Errorf("Expected %v but got %v", time.Sunday, result3.Weekday())
	}

	// Add more test cases as needed
}
