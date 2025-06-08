package shared

import (
	"encoding/json"
	"github.com/stretchr/testify/assert"
	"testing"
)

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
	eventQueries := MockEventService{}
	var dumper = SharedActivities{
		EmailClient:  &emailClient,
		EventService: &eventQueries,
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
	assert.Len(t, eventQueries.Events, 1)
}
