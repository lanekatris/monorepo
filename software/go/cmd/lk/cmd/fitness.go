/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"fmt"
	"github.com/charmbracelet/log"
	"go.temporal.io/sdk/client"
	"shared"
	"shared/temporalstuff"

	"github.com/spf13/cobra"
)

// fitnessCmd represents the fitness command
var fitnessCmd = &cobra.Command{
	Use:   "fitness",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("fitness called")
		log.Info("Kicking...")

		c, err := client.Dial(client.Options{
			HostPort: "server1.local:7233",
		})
		if err != nil {
			//log.Fatalln("unable to create Temporal client", err)
			log.Fatalf("unable to create temporal client", err)
		}
		defer c.Close()

		options := client.StartWorkflowOptions{
			ID:        "greeting-workflow",
			TaskQueue: shared.GreetingTaskQueue,
		}

		// Start the Workflow
		name := "World"
		we, err := c.ExecuteWorkflow(context.Background(), options, temporalstuff.SendFitnessEmailWorkflow, name)
		if err != nil {
			//log.Fatalln("unable to complete Workflow", err)
			log.Fatalf("unable to complete workflow", err)
		}

		// Get the results
		//var greeting string
		//err = we.Get(context.Background(), &greeting)
		//if err != nil {
		//	log.Fatalln("unable to get Workflow result", err)
		//}

		printResults("", we.GetID(), we.GetRunID())
	},
}

func printResults(greeting string, workflowID, runID string) {
	fmt.Printf("\nWorkflowID: %s RunID: %s\n", workflowID, runID)
	fmt.Printf("\n%s\n\n", greeting)
}

func init() {
	rootCmd.AddCommand(fitnessCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// fitnessCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// fitnessCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
