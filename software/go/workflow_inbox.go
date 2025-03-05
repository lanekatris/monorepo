package shared

import (
	"errors"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/workflow"
	"io/ioutil"
	"net/http"
	"time"
)

func GetEmailData(apiUrl string) (string, error) {
	response, err := http.Get(apiUrl)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	bytes, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return "", err
	}

	return string(bytes), nil
}

func WorkflowInbox(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var apiUrl = viper.GetString("inbox_url")
	if apiUrl == "" {
		return errors.New("Inbox URL is required in config")
	}

	var data string
	err := workflow.ExecuteActivity(ctx, GetEmailData, apiUrl).Get(ctx, &data)
	if err != nil {
		return err
	}

	var activities *WorkflowInputDumper
	err = workflow.ExecuteActivity(ctx, activities.DumpEvent, "inbox_data_received_v1", data).Get(ctx, nil)
	return err

}
