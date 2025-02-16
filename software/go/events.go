package shared

import (
	"database/sql"
	"github.com/charmbracelet/log"
	"gorm.io/gorm"
)

type EventName int64

const (
	WaterLevel EventName = iota
	EmailDogWaterSent
)

func (e EventName) String() string {
	switch e {
	case WaterLevel:
		return "water_level_v1"
	case EmailDogWaterSent:
		return "email_dog_water_sent_v1"
	}
	return "unknown"
}

type EventService interface {
	WasEventCreatedRecently(eventName string) bool
	CreateEvent(event EventName, data string) error
	//GetLastEventByType(event EventName) Event
	//GormDb *gorm.DB
	//GetGormDb() *gorm.DB
}

type MockEventService struct {
	History []string
	Events  []Event
}

func (m *MockEventService) WasEventCreatedRecently(eventName string) bool {
	for _, event := range m.History {
		if event == eventName {
			return true
		}
	}

	m.History = append(m.History, eventName)
	return false
}

func (m *MockEventService) CreateEvent(event EventName, data string) error {
	m.Events = append(m.Events, Event{
		EventName: event.String(),
		Data:      sql.NullString{String: data, Valid: true},
	})
	return nil
}

type DbEventService struct {
	Db *gorm.DB
}

func (p *DbEventService) WasEventCreatedRecently(eventName string) bool {
	var event = Event{}
	p.Db.Where("event_name = ?", eventName).Order("created_at DESC").First(&event)

	if event.Id == 0 {
		return false
	}

	return IsWithin24Hours(event.CreatedAt)
}

func (p *DbEventService) CreateEvent(event EventName, data string) error {
	var e = Event{
		EventName: event.String(),
		Data:      sql.NullString{String: data, Valid: true},
	}
	result := p.Db.Create(&e)
	if result.Error != nil {
		return result.Error
	}

	log.Info("Inserted event", "name", event, "id", e.Id)
	return nil
}
