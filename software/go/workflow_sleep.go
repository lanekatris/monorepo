package shared

import (
	"go.temporal.io/sdk/workflow"
	"time"
)

func WorkflowSleep(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var o = ExecOnHostArgs{
		Name: "bash",
		Args: []string{"-c", "(sleep 2; systemctl suspend) &"},
	}
	err := workflow.ExecuteActivity(ctx, ExecOnHost, o).Get(ctx, nil)

	return err
}
