package shared

import (
	"encoding/json"
	"github.com/charmbracelet/log"
	"go.temporal.io/sdk/workflow"
	"time"
)

func WorkflowLogger(ctx workflow.Context, eventName string, data string) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	if eventName == "twitch_stream_online_v1" {
		var d StreamData
		err := json.Unmarshal([]byte(data), &d)
		if err != nil {
			return err
		}

		log.Info("Twitch stream online", "name", d.UserName)

	} else {
		log.Info("Event Logged", "name", eventName)
	}

	return nil
}
