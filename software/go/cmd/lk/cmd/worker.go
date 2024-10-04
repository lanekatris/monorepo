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

// workerCmd represents the worker command
var workerCmd = &cobra.Command{
	Use:   "worker",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("worker called")

		c, err := client.Dial(client.Options{
			HostPort: "192.168.86.100:7233",
		})
		if err != nil {
			log.Fatalf("unable to create Temporal client", err)
		}
		defer c.Close()

		shared.SetupViper()

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

		scheduleID := "schedule_id2"
		workflowID := "schedule_workflow_id"

		list, err := c.ScheduleClient().List(context.Background(), client.ScheduleListOptions{})
		shared.HandleError(err)

		var scheduleExists = false
		for list.HasNext() {
			n, err := list.Next()
			shared.HandleError(err)
			if n.ID == scheduleID {
				scheduleExists = true
			}
		}

		if scheduleExists == false {
			_, err := c.ScheduleClient().Create(context.Background(), client.ScheduleOptions{
				ID: scheduleID,
				Spec: client.ScheduleSpec{
					CronExpressions: []string{"0 */12 * * *"},
				},
				Action: &client.ScheduleWorkflowAction{
					ID:        workflowID,
					Workflow:  shared.WorkflowMinifluxToS3,
					TaskQueue: shared.GreetingTaskQueue,
				},
			})
			shared.HandleError(err)
		}

		// Start listening to the Task Queue
		err = w.Run(worker.InterruptCh())
		if err != nil {
			log.Fatalf("unable to start Worker", err)
		}
	},
}

func init() {
	rootCmd.AddCommand(workerCmd)
	rootCmd.PersistentFlags().Bool("server", false, "Run as a server worker")

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// workerCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// workerCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
