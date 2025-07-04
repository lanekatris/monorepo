/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"github.com/charmbracelet/fang"
	"github.com/spf13/cobra"
	"os"
	"strings"
)

//func countChecked(content string) int {
//	// Create a regular expression pattern to match checked checkboxes ([x])
//	re := regexp.MustCompile(`\[x\]`)
//
//	// Find all matches in the content
//	matches := re.FindAllString(content, -1)
//
//	// Return the count of matches
//	return len(matches)
//}

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "lk",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	//Run: func(cmd *cobra.Command, args []string) {
	//	//log.Info("ahh")
	//	//err := beeep.Notify("Title", "Message body", "C:\\Users\\looni\\OneDrive\\Pictures\\Camera Roll\\393146857_2402553829927542_4045854401555263033_n.jpg")
	//	//if err != nil {
	//	//	panic(err)
	//	//}
	//
	//	//temporalstuff.GetFitnessIdk()
	//	//directoryPath2 := shared.GetPath("/home/lane/Documents/lkat-vault", "C:\\Users\\looni\\vault1")
	//	//idk := fitness.GetFitnessActivities(directoryPath2)
	//	//log.Info(idk)
	//
	//	//fitness.PersistFitnessActivities(idk)
	//	//var connStr = viper.GetString("POSTGRES_CONN")
	//	//if connStr == "" {
	//	//	return nil, errors.New("config not found: " + "POSTGRES_CONN")
	//	//}
	//	//
	//	//db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})
	//	//shared.HandleError(err)
	//	//
	//	//db.Create(Obsidi)
	//
	//},
}

func prependZeros(original string, totalLength int) string {
	if len(original) >= totalLength {
		return original
	}

	zeroCount := totalLength - len(original)
	zeroString := strings.Repeat("0", zeroCount)
	return zeroString + original
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	//err := rootCmd.Execute()
	//if err != nil {
	//	os.Exit(1)
	//}

	//cmd :=
	if err := fang.Execute(context.Background(), rootCmd); err != nil {
		os.Exit(1)
	}
}

func init() {
	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.

	// rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.lk.yaml)")
	// // inboxCmd.PersistentFlags().String("foo", "", "A help for foo")
	rootCmd.PersistentFlags().BoolP("json", "j", false, "Ouptut as JSON")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
