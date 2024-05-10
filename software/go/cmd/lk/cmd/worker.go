/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"github.com/charmbracelet/log"
	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"
	"shared"
	"shared/temporalstuff"

	"github.com/spf13/cobra"
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
			HostPort: "server1.local:7233",
		})
		if err != nil {
			log.Fatalf("unable to create Temporal client", err)
		}
		defer c.Close()

		shared.SetupViper()
		// This worker hosts both Workflow and Activity functions
		w := worker.New(c, shared.GreetingTaskQueue, worker.Options{})
		w.RegisterWorkflow(temporalstuff.SendFitnessEmailWorkflow)
		w.RegisterWorkflow(temporalstuff.ObsidianThemeWorkflow)

		w.RegisterActivity(temporalstuff.SendFitnessEmailActivity)
		w.RegisterActivity(temporalstuff.LoadAndPersistObsidianThemeFile)

		db, err := shared.GetDb()
		shared.HandleError(err)

		var activities = &shared.ObsidianAdventuresActivityInput{Db: db}

		w.RegisterWorkflow(shared.LoadObsidianAdventuresWorkflow)
		//w.RegisterActivity(shared.DeleteAdventureData, db)
		w.RegisterActivity(activities)

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
	// workerCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// workerCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
