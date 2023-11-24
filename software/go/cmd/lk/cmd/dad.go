/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"os/exec"

	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
)

// dadCmd represents the dad command
var dadCmd = &cobra.Command{
	Use:   "dad",
	Short: "Create printout",
	Long:  `Create printout for dad`,
	Run: func(cmd *cobra.Command, args []string) {
		log.Info("Printing...")
		cmdd := exec.Command("powershell", "-command", "get-content", `'C:\Users\looni\OneDrive\Documents\vault1\Dad Printout.md'`, "|", "out-printer")
		err := cmdd.Start()
		if err != nil {
			panic(err)
		}
		log.Info("Printed!")
	},
}

func init() {
	rootCmd.AddCommand(dadCmd)
}
