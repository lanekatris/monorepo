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
	db2 "shared/db"
)

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

	var screenFetchParams = []interface{}{shared.ExecOnHostArgs{
		Name: "screenfetch",
		Args: []string{"-N"},
	}}

	// Create schedules
	var schedules = []client.ScheduleOptions{
		//client.ScheduleOptions{
		//	ID: "schedule_miniflux_to_s3",
		//	Spec: client.ScheduleSpec{
		//		CronExpressions: []string{"0 */12 * * *"},
		//	},
		//	Action: &client.ScheduleWorkflowAction{
		//		ID:        "action_miniflux_to_s3",
		//		Workflow:  shared.WorkflowMinifluxToS3,
		//		TaskQueue: "server",
		//	},
		//},
		client.ScheduleOptions{
			ID: "schedule_obsidian_files_to_db",
			Spec: client.ScheduleSpec{
				// Every 12 hours
				CronExpressions: []string{"0 */12 * * *"}, // https://crontab.guru/#0_*/12_*_*_*
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
				Workflow:  shared.WorkflowGetOsInfoV2,
				TaskQueue: shared.GreetingTaskQueue,
				//Args:      createBackupArgs("linux_desktop"),
				//Args: []interface{}{screenFetchParams},
				Args: screenFetchParams,
			},
		},
		client.ScheduleOptions{
			ID: "schedule_os_info_server1",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"0 3 * * 0"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_os_info_server1",
				Workflow:  shared.WorkflowGetOsInfoV2,
				TaskQueue: "server",
				Args:      screenFetchParams,
			},
		},

		client.ScheduleOptions{
			ID: "schedule_os_info_windows",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"0 3 * * 0"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_os_info_windows",
				Workflow:  shared.WorkflowGetOsInfoV2,
				TaskQueue: "windows",
				Args: []interface{}{shared.ExecOnHostArgs{
					Name: "powershell",
					Args: []string{"-command", "get-computerinfo | select-object WindowsProductName, CsTotalPhysicalMemory,CsModel,CsManufacturer,CsProcessors | convertto-json"},
				}},
			},
		},

		{
			ID: "schedule_podcast",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"@daily"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_schedule_podcast",
				Workflow:  shared.WorkflowPodcasts,
				TaskQueue: "server",
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
		//client.ScheduleOptions{
		//	ID: "schedule_get_washer_power",
		//	Spec: client.ScheduleSpec{
		//		CronExpressions: []string{"*/30 * * * *"}, // Every 30 minutes
		//	},
		//	Action: &client.ScheduleWorkflowAction{
		//		ID:        "action_get_washer_power",
		//		Workflow:  shared.WorkflowPowerOutlet,
		//		TaskQueue: shared.ServerQueue,
		//	},
		//},
		client.ScheduleOptions{
			ID: "schedule_get_inbox",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"0 */12 * * *"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_get_inbox",
				Workflow:  shared.WorkflowInbox,
				TaskQueue: shared.ServerQueue,
			},
		},
		//{
		//	ID: "schedule_twitch",
		//	Spec: client.ScheduleSpec{
		//		CronExpressions: []string{"*/30 * * * *"},
		//	},
		//	Action: &client.ScheduleWorkflowAction{
		//		ID:        "action_twitch",
		//		Workflow:  shared.WorkflowTwitch,
		//		TaskQueue: shared.ServerQueue,
		//	},
		//},
		{
			ID: "schedule_climb",
			Spec: client.ScheduleSpec{
				CronExpressions: []string{"0 0 * * WED"},
			},
			Action: &client.ScheduleWorkflowAction{
				ID:        "action_climb",
				Workflow:  shared.WorkflowClimb,
				TaskQueue: shared.ServerQueue,
			},
		},
		// I'm to the point this isn't being useful
		//{
		//	ID: "schedule_vitamins",
		//	Spec: client.ScheduleSpec{
		//		CronExpressions: []string{"0 0 * * *"}, // every day at 8pm (1 (instead of 2) UTC because temporal is being weird about 8pm...)
		//	},
		//	Action: &client.ScheduleWorkflowAction{
		//		ID:        "action_vitamins",
		//		Workflow:  shared.WorkflowVitamins,
		//		TaskQueue: shared.ServerQueue,
		//	},
		//},
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
			HostPort: shared.TemporalAddress, // "100.99.14.109:7233",
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
		fmt.Println("temporal_queue_name:", queueName)
		w := worker.New(c, queueName, worker.Options{})
		//w.RegisterWorkflow(temporalstuff.SendFitnessEmailWorkflow)
		//w.RegisterWorkflow(temporalstuff.ObsidianThemeWorkflow)

		//w.RegisterActivity(temporalstuff.SendFitnessEmailActivity)
		//w.RegisterActivity(temporalstuff.LoadAndPersistObsidianThemeFile)

		gormDb, err := shared.GetGormDb()
		shared.HandleError(err)

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

		w.RegisterWorkflow(shared.WorkflowGetOsInfoV2)
		w.RegisterActivity(shared.ExecOnHost)
		w.RegisterActivity(shared.KvPut)

		var connStr = viper.GetString(shared.ResendApiKeyConfig)
		if connStr == "" {
			panic("Config not found: " + shared.ResendApiKeyConfig)
		}

		pgxConn, err := shared.GetPgxDb()
		shared.HandleError(err)

		// trying out sqlc generated queries, seems interesting
		queries := db2.New(pgxConn)

		var dumperActivities = &shared.SharedActivities{
			Db:          gormDb,
			EmailClient: shared.NewResendClient(connStr),
			EventService: &shared.DbEventService{
				Db: gormDb,
			},
			Queries: queries,
		}
		w.RegisterWorkflow(shared.WorkflowDumper)
		w.RegisterActivity(dumperActivities)

		// Climb.rest
		w.RegisterWorkflow(shared.WorkflowClimbRest)
		w.RegisterActivity(shared.BuildClimbRest)
		w.RegisterActivity(shared.GetClimbRestData)

		// Power monitor
		w.RegisterWorkflow(shared.WorkflowPowerOutlet)
		w.RegisterActivity(shared.GetPowerMonitoringOutletData)

		// Inbox
		w.RegisterWorkflow(shared.WorkflowInbox)
		w.RegisterActivity(shared.GetEmailData)

		// Podcast
		w.RegisterWorkflow(shared.WorkflowPodcasts)

		// Playing around
		w.RegisterWorkflow(shared.WorkflowLogger)

		w.RegisterWorkflow(shared.WorkflowTwitch)
		w.RegisterActivity(shared.KvGetString)
		w.RegisterActivity(shared.GetTwitchToken)
		w.RegisterActivity(shared.GetStreamByUserID)

		w.RegisterWorkflow(shared.WorkflowSleep)

		w.RegisterWorkflow(shared.WorkflowClimb)

		w.RegisterWorkflow(shared.WorkflowVitamins)

		w.RegisterActivity(shared.ToggleElgatoLight)

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
