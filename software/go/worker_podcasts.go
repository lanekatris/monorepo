package shared

import (
	"go.temporal.io/sdk/workflow"
	"time"
)

func WorkflowPodcasts(ctx workflow.Context) (info string, err error) {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 8 * time.Hour,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	var result string
	var o = ExecOnHostArgs{
		Name: "du",
		Args: []string{"-h", "--max-depth=1", "/bigboy/audiobookshelf"},
	}
	err = workflow.ExecuteActivity(ctx, ExecOnHost, o).Get(ctx, &result)
	if err != nil {
		return "", err
	}

	err = workflow.ExecuteActivity(ctx, KvPut, "podcast_dir_size.txt", result).Get(ctx, nil)
	if err != nil {
		return "", err
	}

	return result, nil
}
