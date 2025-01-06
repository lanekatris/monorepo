package shared

import "gorm.io/gorm"

type EventQueries interface {
	WasEventCreatedRecently(eventName string) bool
}

type MockEventQueries struct {
	History []string
}

func (m *MockEventQueries) WasEventCreatedRecently(eventName string) bool {
	for _, event := range m.History {
		if event == eventName {
			return true
		}
	}

	m.History = append(m.History, eventName)
	return false
}

type PostgresEventQueries struct {
	Db *gorm.DB
}

func (p *PostgresEventQueries) WasEventCreatedRecently(eventName string) bool {
	var event = Event{}
	p.Db.Where("event_name = ?", eventName).Order("created_at DESC").First(&event)

	if event.Id == 0 {
		return false
	}

	return IsWithin24Hours(event.CreatedAt)
}
