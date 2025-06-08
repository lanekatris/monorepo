package shared

import (
	"github.com/charmbracelet/log"
	"go.temporal.io/sdk/workflow"
	"time"
)

func WorkflowVitamins(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var activities *SharedActivities

	var diddoit bool
	err := workflow.ExecuteActivity(ctx, activities.DidDoTagToday, "vitamins-v2").Get(ctx, &diddoit)
	if err != nil {
		return err
	}

	if diddoit == false {
		log.Info("sending email")
		err := workflow.ExecuteActivity(ctx, activities.SendEmail, "lanekatris@gmail.com", "Take your vitamins", "Take your vitamins").Get(ctx, nil)
		if err != nil {
			return err
		}

	} else {
		log.Info("NOT sending email")
	}

	return nil
}
