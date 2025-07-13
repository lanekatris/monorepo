/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"fmt"
	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
	"go.temporal.io/api/workflowservice/v1"
	"go.temporal.io/sdk/client"
	"shared"
)

func GetTemporalClient() (client.Client, error) {

	return client.Dial(client.Options{
		HostPort: "100.99.14.109:7233",
	})

}

var kickCmd = &cobra.Command{
	Use:   "kick",
	Short: "A brief description of your command",
	Long:  `A a`,
	Args:  cobra.MatchAll(cobra.ExactArgs(1), cobra.OnlyValidArgs),
}

var kickTwitchCmd = &cobra.Command{
	Use: "twitch",
	Run: func(cmd *cobra.Command, args []string) {
		err := invokeKickWorkflow(shared.WorkflowTwitch)
		shared.HandleErrorExit(err)
		log.Info("Success")
	},
}

var kickVitaminsCmd = &cobra.Command{
	Use: "vitamins",
	Run: func(cmd *cobra.Command, args []string) {
		err := invokeKickWorkflow(shared.WorkflowVitamins)
		shared.HandleErrorExit(err)
		log.Info("Success")
	},
}

var kickObsidianCmd = &cobra.Command{
	Use: "obsidian",
	Run: func(cmd *cobra.Command, args []string) {
		err := invokeKickWorkflow(shared.WorkflowMarkdownToDb)
		shared.HandleErrorExit(err)
		log.Info("Success")

	},
}

var kickInboxCmd = &cobra.Command{
	Use: "inbox",
	Run: func(cmd *cobra.Command, args []string) {
		err := invokeKickWorkflow(shared.WorkflowInbox)
		shared.HandleErrorExit(err)
		log.Info("Success")
	},
}

func invokeKickWorkflow(hi interface{}) error {
	cc, err := GetTemporalClient()
	if err != nil {
		return err
	}
	options := client.StartWorkflowOptions{
		ID:        "cli-kick-workflow",
		TaskQueue: "server",
	}
	_, err = cc.ExecuteWorkflow(context.Background(), options, hi)
	if err != nil {
		return err
	}
	return nil
}

var temporalWorkflowsCmd = &cobra.Command{
	Use: "temporal",
	Run: func(cmd *cobra.Command, args []string) {
		cc, err := GetTemporalClient()
		shared.HandleErrorExit(err)
		//cc.GetWorkflowHistory(),
		grpcClient := cc.WorkflowService()
		req := &workflowservice.ListWorkflowExecutionsRequest{
			Namespace: "default", PageSize: 5, // Query: "OrderBy DESC",
		}

		resp, err := grpcClient.ListWorkflowExecutions(context.Background(), req)
		shared.HandleErrorExit(err)
		for i, exec := range resp.Executions {
			fmt.Printf("%d. WorkflowID: %s | RunID: %s | Type: %s | StartTime: %v | Status: %s\n",
				i+1,
				exec.Execution.WorkflowId,
				exec.Execution.RunId,
				exec.Type.Name,
				exec.StartTime,
				exec.Status,
			)
		}
	},
}

func init() {
	rootCmd.AddCommand(kickCmd)
	kickCmd.AddCommand(kickTwitchCmd)
	kickCmd.AddCommand(kickVitaminsCmd)
	kickCmd.AddCommand(kickObsidianCmd)
	kickCmd.AddCommand(temporalWorkflowsCmd)
	kickCmd.AddCommand(kickInboxCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// kickCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// kickCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
