package shared

import (
	"bytes"
	"go.temporal.io/sdk/workflow"
	"os/exec"
	"time"
)

func WorkflowPowerOutlet(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var response string
	err := workflow.ExecuteActivity(ctx, GetPowerMonitoringOutletData).Get(ctx, &response)
	if err != nil {
		return err
	}

	var activities *SharedActivities
	err = workflow.ExecuteActivity(ctx, activities.DumpEvent, "power_monitoring_outlet_v1", response).Get(ctx, nil)

	return err
}

func GetPowerMonitoringOutletData() (string, error) {
	cmd := exec.Command("kasa", "--host", "192.168.86.43", "--json", "state")
	// dump the data
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr

	err := cmd.Run()
	if err != nil {
		return "", err
	}
	return out.String(), nil
}
