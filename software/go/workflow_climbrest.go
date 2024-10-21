package shared

import (
	"crypto/tls"
	"errors"
	"github.com/charmbracelet/log"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/workflow"
	"io/ioutil"
	"net/http"
	"time"
)

func BuildClimbRest() error {
	var filesPath = viper.GetString("CLIMBREST_BUILD_HOOK")
	if filesPath == "" {
		return errors.New("Config not found: CLIMBREST_BUILD_HOOK")
	}

	response, err := http.Post(filesPath, "text/plain", nil)
	if err != nil {
		return err
	}

	if response.StatusCode != http.StatusOK {
		return errors.New(response.Status)
	}
	log.Info("Called climb rest build hook")
	return nil
}

func GetClimbRestData() (string, error) {
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	response, err := client.Get("https://www.lrh-wc.usace.army.mil/wm/data/json/projects/sug_15M.min.json.js")
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

func WorkflowClimbRest(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}
	ctx = workflow.WithActivityOptions(ctx, options)

	err := workflow.ExecuteActivity(ctx, BuildClimbRest).Get(ctx, nil)
	if err != nil {
		return err
	}

	var data string
	err = workflow.ExecuteActivity(ctx, GetClimbRestData).Get(ctx, &data)

	err = workflow.ExecuteActivity(ctx, DumpEvent, "climbrest_build_kicked", data).Get(ctx, nil)

	return err

}
