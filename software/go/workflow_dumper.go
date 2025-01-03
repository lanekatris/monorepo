package shared

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/charmbracelet/log"
	"go.temporal.io/sdk/workflow"
	"gorm.io/gorm"
	"os/exec"
	"time"
)

// func (input *WorkflowInputMinifluxToS3) GetRssFeeds() ([]RssFeed, error) {
// func DumpEvent(eventName string, data string) error {
func (input *WorkflowInputDumper) DumpEvent(eventName string, data string) error {
	//db, err := GetGormDb()
	//if err != nil {
	//	return err
	//}
	var e = Event{
		EventName: eventName,
		Data:      sql.NullString{String: data, Valid: true},
	}
	result := input.Db.Create(&e)
	if result.Error != nil {
		return result.Error
	}

	log.Info("Inserted event", "name", eventName, "id", e.Id)
	return nil
}

type ToggleSwitchedData struct {
	Value    int    `json:"value"`
	SwitchId string `json:"switch_id"`
}

func (input *WorkflowInputDumper) ProcessEvent(eventName string, data string) error {
	if eventName == "toggle_switched_v1" {

		var switchData ToggleSwitchedData

		var err = json.Unmarshal([]byte(data), &switchData)

		if err != nil {
			log.Error("11111",
				"d", data)
			log.Error(err)
			return err
		}

		var ipAddress string = ""
		if switchData.SwitchId == "troy_control_panel_1" { // small light
			ipAddress = "192.168.86.37"
		}
		if switchData.SwitchId == "troy_control_panel_2" { // blue fan
			ipAddress = "192.168.86.47"
		}
		if switchData.SwitchId == "troy_control_panel_3" { // big light
			ipAddress = "192.168.86.24"
		}
		if switchData.SwitchId == "troy_control_panel_4" { // tree
			ipAddress = "192.168.86.44"
		}

		var value string
		if switchData.Value == 1 {
			value = "on"
		} else {
			value = "off"
		}

		cmd := exec.Command("kasa", "--host", ipAddress, value)

		var out bytes.Buffer
		var stderr bytes.Buffer
		cmd.Stdout = &out
		cmd.Stderr = &stderr

		err = cmd.Run()

		if err != nil {
			fmt.Println(fmt.Sprint(err) + ": " + stderr.String())
			return err
		}

		return nil

	}

	return nil
}
func WorkflowDumper(ctx workflow.Context, eventName string, data string) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var activities *WorkflowInputDumper

	err := workflow.ExecuteActivity(ctx, activities.ProcessEvent, eventName, data).Get(ctx, nil)
	if err != nil {
		return err
	}
	err = workflow.ExecuteActivity(ctx, activities.DumpEvent, eventName, data).Get(ctx, nil)

	return err
}

type WorkflowInputDumper struct {
	Db *gorm.DB
}
