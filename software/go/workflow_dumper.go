package shared

import (
	"encoding/json"
	"os"
	"path"
	"strings"
	"time"

	"github.com/charmbracelet/log"
	"github.com/google/uuid"
	"go.temporal.io/api/enums/v1"
	"go.temporal.io/sdk/temporal"
	"go.temporal.io/sdk/workflow"
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

	// todo: this all may be long running... your supposed to do the real work in activities brother...
	if eventName == "obsidian_queue_item_added_v1" {

		var d ObsidianQueueItemAdded

		var err = json.Unmarshal([]byte(data), &d)
		if err != nil {
			return err
		}

		filename := time.Now().Format("2006-01-02")
		// p := path.Join("/home/lane/Documents/lkat-vault", filename+".md")
		p := path.Join("/bigboy/obsidian/config/vault/lkat-vault", filename+".md")

		// Is it there yet?
		for i := range 5 {
			log.Info("Running iteration", "count", i, "path", p)

			if fileExists(p) == false {
				log.Info("File doesn't exist, sleeping: " + p)
				err = workflow.Sleep(ctx, 5*time.Minute)
				if err != nil {
					return err
				}
			} else {
				break
			}

		}

		fileContents, err := os.ReadFile(p)
		if err != nil {
			return err
		}

		if strings.Contains(string(fileContents), d.Message) {
			log.Info("Message already in file, not doing anything: " + d.Message)
		} else {
			f, err := os.OpenFile(p, os.O_APPEND|os.O_WRONLY, 0644)
			if err != nil {
				return err
			}

			defer f.Close()

			if _, err := f.WriteString("\n" + "- [ ] " + d.Message + "\n"); err != nil {
				return err
			}

			log.Info("Line added: " + d.Message)
		}

		// - refresh the task counter
		// - this must be accessible from my phone, cli doesn't make sense

	}

	// This is here since it needs access to the "workflow" object
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
