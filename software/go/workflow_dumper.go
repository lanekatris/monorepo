package shared

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/charmbracelet/log"
	"go.temporal.io/api/enums/v1"
	"go.temporal.io/sdk/temporal"
	"go.temporal.io/sdk/workflow"
	"gorm.io/gorm"
	"os/exec"
	"time"
)

func (input *WorkflowInputDumper) DumpEvent(eventName string, data string) error {
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

	// send notification if zekes water bowl is empty
	if eventName == "water_level_v1" {
		var waterLevelData WaterLevelData

		var err = json.Unmarshal([]byte(data), &waterLevelData)
		if err != nil {
			return err
		}

		if waterLevelData.Data >= 100 {
			return nil
		}

		createdRecently := input.EventService.WasEventCreatedRecently("email_dog_water_sent_v1")
		if createdRecently {
			log.Info("Water needs refilled, but notification already sent")
			return nil
		}

		log.Info("Sending email...")
		err = input.EmailClient.SendEmail("lanekatris@gmail.com", "Zeke's bowl needs filled", "Zeke's bowl needs filled")
		if err != nil {
			return err
		}
		err = input.EventService.CreateEvent(EmailDogWaterSent, "")
		if err != nil {
			return err
		}
		return nil
	}

	// send notification when the washer finishes
	if eventName == "power_monitoring_outlet_v1" {
		var d PowerMonitoringData

		var err = json.Unmarshal([]byte(data), &d)
		if err != nil {
			return err
		}

		if d.Emeter.GetRealtime.PowerMw > 10000 {
			var event = Event{}
			input.Db.Where("event_name = ?", "power_monitoring_outlet_v1").Order("created_at DESC").First(&event)

			if event.Id == 0 || !event.Data.Valid {
				return nil
			}

			var d2 PowerMonitoringData
			err = json.Unmarshal([]byte(event.Data.String), &d2)
			if err != nil {
				return err
			}

			if d2.Emeter.GetRealtime.PowerMw < 10000 {
				// did we send a notification recently?
				//input.Db.w
				createdRecently := input.EventService.WasEventCreatedRecently("email_washer_sent_v1")
				if createdRecently {
					log.Info("Email already sent about washing maching")
					return nil
				}

				// if under 10k the washer is done, send notification

			}
		}

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
	if err != nil {
		return err
	}

	childOptions := workflow.ChildWorkflowOptions{
		WorkflowID:        "log-event-dumper",
		TaskQueue:         GreetingTaskQueue,
		ParentClosePolicy: enums.PARENT_CLOSE_POLICY_ABANDON,
		WorkflowIDReusePolicy: enums.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE,
	}

	childCtx := workflow.WithChildOptions(ctx, childOptions)

	err = workflow.ExecuteChildWorkflow(childCtx, WorkflowLogger, eventName).GetChildWorkflowExecution().Get(childCtx, nil)
	if temporal.IsWorkflowExecutionAlreadyStartedError(err) {
		return nil
	}

	return err
}

type WorkflowInputDumper struct {
	Db           *gorm.DB
	EmailClient  EmailClient
	EventService EventService
}

func WorkflowLogger(ctx workflow.Context, eventName string) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	log.Info("Event Logged", "name", eventName)
	return nil
}
