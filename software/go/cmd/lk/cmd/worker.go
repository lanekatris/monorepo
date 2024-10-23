/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"fmt"
	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"
	"shared"
)

func createBackupArgs(prefix string) []interface{} {
	strSlice := []string{prefix}
	interfaceSlice := make([]interface{}, len(strSlice))

	for i, v := range strSlice {
		interfaceSlice[i] = v
	}

	return interfaceSlice
}

func deploySchedulesV2(c client.Client) {
	list, err := c.ScheduleClient().List(context.Background(), client.ScheduleListOptions{})
	shared.HandleError(err)

	// Delete all schedules
	for list.HasNext() {
		n, err := list.Next()
		shared.HandleError(err)

		log.Warn("Deleting schedule", "id", n.ID)
		handle := c.ScheduleClient().GetHandle(context.Background(), n.ID)
		err = handle.Delete(context.Background())
		shared.HandleError(err)
	}

	// Create schedules
	var schedules = []client.ScheduleOptions{
		client.ScheduleOptions{
			ID: "schedule_miniflux_to_s3",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"0 */12 * * *"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_miniflux_to_s3",
				Workflow:  shared.WorkflowMinifluxToS3,
				TaskQueue: "server",
			},
		},
		client.ScheduleOptions{
			ID: "schedule_obsidian_files_to_db",
			Spec: client.ScheduleSpec{
				// Every 12 hours
				CronExpressions: []string{"0 */2 * * *"}, // https://crontab.guru/#0_*/12_*_*_*
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_obsidian_files_to_db",
				Workflow:  shared.WorkflowMarkdownToDb,
				TaskQueue: "server",
			},
		},
		client.ScheduleOptions{
			ID: "schedule_backup_server1",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"0 3 * * 0"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_backup_server1",
				Workflow:  shared.WorkflowBackupServer,
				TaskQueue: "server",
			},
		},
		client.ScheduleOptions{
			ID: "schedule_os_info_linux_desktop",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"0 3 * * 0"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_os_info_linux_desktop",
				Workflow:  shared.WorkflowGetOsInfo,
				TaskQueue: shared.GreetingTaskQueue,
				Args:      createBackupArgs("linux_desktop"),
			},
		},
		client.ScheduleOptions{
			ID: "schedule_os_info_server1",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"0 3 * * 0"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_os_info_server1",
				Workflow:  shared.WorkflowGetOsInfo,
				TaskQueue: "server",
				Args:      createBackupArgs("server1"),
			},
		},
		client.ScheduleOptions{
			ID: "schedule_build_climb_rest",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"0 */12 * * *"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_build_climb_rest",
				Workflow:  shared.WorkflowClimbRest,
				TaskQueue: "server",
			},
		},
	}
	for _, schedule := range schedules {
		log.Info("Creating schedule", "id", schedule.ID)
		_, err := c.ScheduleClient().Create(context.Background(), schedule)
		shared.HandleError(err)
	}
}

// workerCmd represents the worker command
var workerCmd = &cobra.Command{
	Use:   "worker",
	Short: "The lkat worker listening to temporal",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		log.Info("Connecting to temporal...")
		c, err := client.Dial(client.Options{
			HostPort: "192.168.86.100:7233",
		})
		if err != nil {
			log.Fatalf("unable to create Temporal client", err)
		}
		defer c.Close()

		shared.SetupViper()

		shouldDeploySchedules := cmd.Flag("deploy-schedules").Changed

		if shouldDeploySchedules {
			log.Info("Deploying schedules...")
			deploySchedulesV2(c)
			log.Info("Schedules deployed, exiting")
			return
		}

		// This worker hosts both Workflow and Activity functions
		var queueName = viper.GetString("temporal_queue_name")
		if queueName == "" {
			queueName = shared.GreetingTaskQueue
		}
		fmt.Println("using queue name:", queueName)
		w := worker.New(c, queueName, worker.Options{})
		//w.RegisterWorkflow(temporalstuff.SendFitnessEmailWorkflow)
		//w.RegisterWorkflow(temporalstuff.ObsidianThemeWorkflow)

		//w.RegisterActivity(temporalstuff.SendFitnessEmailActivity)
		//w.RegisterActivity(temporalstuff.LoadAndPersistObsidianThemeFile)

		db, err := shared.GetDb()
		shared.HandleError(err)
		gormDb, err := shared.GetGormDb()
		shared.HandleError(err)

		var activities = &shared.ObsidianAdventuresActivityInput{Db: db, GormDb: gormDb}

		w.RegisterWorkflow(shared.LoadObsidianAdventuresWorkflow)
		w.RegisterActivity(activities)

		minifluxDb, err := shared.GetMinifluxDb()
		shared.HandleError(err)

		var storageClient = shared.GetMinioClient()
		var activitiesTwo = &shared.WorkflowInputMinifluxToS3{
			Db:            minifluxDb,
			StorageClient: storageClient,
		}
		w.RegisterWorkflow(shared.WorkflowMinifluxToS3)
		w.RegisterActivity(activitiesTwo)

		w.RegisterWorkflow(shared.WorkflowBackupServer)
		w.RegisterActivity(shared.BackupFolder)

		// Setup workflow_markdown_to_db
		w.RegisterWorkflow(shared.WorkflowMarkdownToDb)
		w.RegisterActivity(shared.TruncateTable)
		w.RegisterActivity(shared.SyncFolderMarkdownToDb)
		//w.RegisterActivity(shared.GetFilePaths)
		//w.RegisterActivity(shared.GenerateMarkdownModels)
		//w.RegisterActivity(shared.InsertMultipleIntoDb)

		w.RegisterWorkflow(shared.WorkflowGetOsInfo)
		w.RegisterActivity(shared.ExecOnHost)
		w.RegisterActivity(shared.KvPut)

		// Event dumper
		w.RegisterWorkflow(shared.WorkflowDumper)
		w.RegisterActivity(shared.DumpEvent)

		// Climb.rest
		w.RegisterWorkflow(shared.WorkflowClimbRest)
		w.RegisterActivity(shared.BuildClimbRest)
		w.RegisterActivity(shared.GetClimbRestData)

		// Start listening to the Task Queue
		err = w.Run(worker.InterruptCh())
		if err != nil {
			log.Fatalf("unable to start Worker", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(workerCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	workerCmd.Flags().BoolP("deploy-schedules", "d", false, "Upsert temporal schedules")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// workerCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
