/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
	"go.temporal.io/sdk/client"
	"os"
	"shared"
)

// kickCmd represents the kick command
var kickCmd = &cobra.Command{
	Use:   "kick",
	Short: "A brief description of your command",
	Long:  `A a`,
	Args:  cobra.MatchAll(cobra.ExactArgs(1), cobra.OnlyValidArgs),
	Run: func(cmd *cobra.Command, args []string) {
		log.Info("Creating temporal client...")
		cc, err := client.Dial(client.Options{
			HostPort: "192.168.86.100:7233",
		})
		if err != nil {
			log.Error("unable to create Temporal client", err)
			os.Exit(1)

		}
		defer cc.Close()

		options := client.StartWorkflowOptions{
			ID:        "cli-kick-workflow",
			TaskQueue: "server",
		}

		log.Info("Executing workflow...")
		if args[0] == "twitch" {
			we, err := cc.ExecuteWorkflow(context.Background(), options, shared.WorkflowTwitch)
			if err != nil {
				log.Error("unable to complete Workflow", err)
				os.Exit(1)
			}

			err = we.Get(context.Background(), nil)
			if err != nil {
				log.Error("unable to complete Workflow2222", err)
				os.Exit(1)
			}
		} else {
			log.Warn("Unknown workflow type: " + args[0])
		}

		//we, err := cc.ExecuteWorkflow(context.Background(), options, shared.WorkflowMarkdownToDb)
		//if err != nil {
		//	log.Error("unable to complete Workflow", err)
		//	os.Exit(1)
		//}

		log.Info("Workflow finished.")
		//log.Info("Kick success", "workflow", arg)
	},
}

var kickMarkdownCmd = &cobra.Command{
	Use: "deploy-markdown",
	//Args: cobra.MinimumNArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
	},
}

func init() {
	rootCmd.AddCommand(kickCmd)
	kickCmd.AddCommand(kickMarkdownCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// kickCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// kickCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
