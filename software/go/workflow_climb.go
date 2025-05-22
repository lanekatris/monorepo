package shared

import (
	"encoding/csv"
	"encoding/json"
	"go.temporal.io/sdk/workflow"
	"io"
	"strings"
	"time"
)

func WorkflowClimb(ctx workflow.Context) error {

	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var tickData string
	err := workflow.ExecuteActivity(ctx, GetEmailData, "https://www.mountainproject.com/user/7079884/lane-katris/tick-export").Get(ctx, &tickData)

	reader := csv.NewReader(strings.NewReader(tickData))

	headers, err := reader.Read()
	if err != nil {
		return err
	}
	var records []map[string]string

	for {
		row, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}

		record := make(map[string]string)
		for i, value := range row {
			record[headers[i]] = value
		}
		records = append(records, record)
	}

	jsonData, err := json.Marshal(records)
	if err != nil {
		return err
	}

	var activities *WorkflowInputDumper
	err = workflow.ExecuteActivity(ctx, activities.DumpEvent, "climb_ticks_v1", string(jsonData)).Get(ctx, nil)

	return nil
}
