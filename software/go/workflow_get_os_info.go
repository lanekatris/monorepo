package shared

import (
	"go.temporal.io/sdk/workflow"
	"time"
)

func WorkflowGetOsInfoV2(ctx workflow.Context, o ExecOnHostArgs) (info string, err error) {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 8 * time.Hour,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	var result string
	err = workflow.ExecuteActivity(ctx, ExecOnHost, o).Get(ctx, &result)
	if err != nil {
		return "", err
	}

	var activities *SharedActivities
	err = workflow.ExecuteActivity(ctx, activities.DumpEvent, "os_info_v1", result).Get(ctx, nil)

	return result, err

}
