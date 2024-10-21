package shared

import (
	"database/sql"
	"github.com/charmbracelet/log"
	"go.temporal.io/sdk/workflow"
	"time"
)

func DumpEvent(eventName string, data string) error {
	db, err := GetGormDb()
	if err != nil {
		return err
	}
	var e = Event{
		EventName: eventName,
		Data:      sql.NullString{String: data, Valid: true},
	}
	result := db.Create(&e)
	if result.Error != nil {

		return result.Error
	}

	log.Info("Inserted event", "name", eventName, "id", e.Id)
	return nil
}

func WorkflowDumper(ctx workflow.Context, eventName string, data string) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}
	ctx = workflow.WithActivityOptions(ctx, options)

	err := workflow.ExecuteActivity(ctx, DumpEvent, eventName, data).Get(ctx, nil)

	return err
}
