package shared

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"testing"
)

// Mock struct
type MockDumper struct {
	mock.Mock
}

func (m *MockDumper) DumpEvent() error {
	args := m.Called()
	return args.Error(0)
}

func (m *MockDumper) ProcessEvent(eventType string, eventData string) error {
	args := m.Called(eventType, eventData)
	return args.Error(0)
}

func TestProcessEvent(t *testing.T) {
	mockDumper := new(MockDumper)
	mockDumper.On("DumpEvent").Return(nil)

	err := mockDumper.ProcessEvent("water_level_v1", "some_event_data")
	assert.NoError(t, err)
	mockDumper.AssertExpectations(t)
}

func TestProcesEvent(t *testing.T) {
	var data = WaterLevelData{
		Data: 3,
	}
	stringified, err := json.Marshal(data)
	if err != nil {
		t.Error(err)
		return
	}

	emailClient := MockEmailClient{}
	eventQueries := MockEventQueries{}
	var dumper = WorkflowInputDumper{
		EmailClient:  &emailClient,
		EventQueries: &eventQueries,
	}
	//dumper.DumpEvent()

	err = dumper.ProcessEvent("water_level_v1", string(stringified))
	if err != nil {
		t.Error(err)
	}
	err = dumper.ProcessEvent("water_level_v1", string(stringified))
	if err != nil {
		t.Error(err)
	}

	assert.Len(t, emailClient.SentEmails, 1)
}
