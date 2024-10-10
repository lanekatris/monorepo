package shared

import (
	"go.temporal.io/sdk/workflow"
	"time"
)

func WorkflowGetOsInfo(ctx workflow.Context, filePrefix string) (info string, err error) {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 8 * time.Hour,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)
	//logger := workflow.GetLogger(ctx)

	var result string
	//var o = []string{"-N"}
	var o = ExecOnHostArgs{
		Name: "screenfetch",
		Args: []string{"-N"},
	}
	err = workflow.ExecuteActivity(ctx, ExecOnHost, o).Get(ctx, &result)
	if err != nil {
		return "", err
	}

	err = workflow.ExecuteActivity(ctx, KvPut, filePrefix+"_screenfetch_result.txt", result).Get(ctx, nil)
	if err != nil {
		return "", err
	}

	return result, nil

}
