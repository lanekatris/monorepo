package shared

import (
	"encoding/json"
	"github.com/charmbracelet/log"
	"github.com/google/uuid"
	"go.temporal.io/api/enums/v1"
	"go.temporal.io/sdk/temporal"
	"go.temporal.io/sdk/workflow"
	"time"
)

type ToggleSwitchedData struct {
	Value    int    `json:"value"`
	SwitchId string `json:"switch_id"`
}

type NeotrellisData struct {
	ButtonId int `json:"buttonId"`
}

func WorkflowDumper(ctx workflow.Context, eventName string, data string) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var activities *SharedActivities

	err := workflow.ExecuteActivity(ctx, activities.ProcessEvent, eventName, data).Get(ctx, nil)
	if err != nil {
		return err
	}
	err = workflow.ExecuteActivity(ctx, activities.DumpEvent, eventName, data).Get(ctx, nil)
	if err != nil {
		return err
	}

	if eventName == "neotrellis_v1" {
		var neotrellisData NeotrellisData
		var err = json.Unmarshal([]byte(data), &neotrellisData)
		if err != nil {
			return err
		}

		if neotrellisData.ButtonId == 12 {
			childOptions := workflow.ChildWorkflowOptions{
				WorkflowID:               "sleep-from-neotrellis-" + uuid.New().String(),
				TaskQueue:                GreetingTaskQueue,
				ParentClosePolicy:        enums.PARENT_CLOSE_POLICY_ABANDON,
				WorkflowExecutionTimeout: time.Minute,
				RetryPolicy: &temporal.RetryPolicy{
					MaximumAttempts: 1,
				},
			}

			childCtx := workflow.WithChildOptions(ctx, childOptions)

			err = workflow.ExecuteChildWorkflow(childCtx, WorkflowSleep).GetChildWorkflowExecution().Get(childCtx, nil)

			if err != nil {
				return err
			}

		} else if neotrellisData.ButtonId == 8 {
			//// Turn on elgato light
			//err = turnOnElgatoLight()
			//if err != nil {
			//	return err
			//}

			err := workflow.ExecuteActivity(ctx, ToggleElgatoLight).Get(ctx, nil)
			if err != nil {
				return err
			}

		} else {
			log.Info("Not mapped", "event_id", neotrellisData.ButtonId)
		}

	}

	childOptions := workflow.ChildWorkflowOptions{
		WorkflowID:            "log-event-dumper",
		TaskQueue:             GreetingTaskQueue,
		ParentClosePolicy:     enums.PARENT_CLOSE_POLICY_ABANDON,
		WorkflowIDReusePolicy: enums.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE,
	}

	childCtx := workflow.WithChildOptions(ctx, childOptions)

	err = workflow.ExecuteChildWorkflow(childCtx, WorkflowLogger, eventName, data).GetChildWorkflowExecution().Get(childCtx, nil)
	if temporal.IsWorkflowExecutionAlreadyStartedError(err) {
		return nil
	}

	return err
}
