/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"io/fs"
	"log"
	"path/filepath"

	"github.com/spf13/cobra"
)

// jsonTestCmd represents the jsonTest command
var jsonTestCmd = &cobra.Command{
	Use:   "jsonTest",
	Short: "Looks at markdown files and creates json as events",
	Run: func(cmd *cobra.Command, args []string) {

		err := filepath.Walk(args[0], func(path string, info fs.FileInfo, err error) error {
			if err != nil {
				return err
			}
			fmt.Println(info.Name(), info.Size())

			return nil
		})
		if err != nil {
			log.Println(err)
		}
	},
}

func init() {
	rootCmd.AddCommand(jsonTestCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// jsonTestCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// jsonTestCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
