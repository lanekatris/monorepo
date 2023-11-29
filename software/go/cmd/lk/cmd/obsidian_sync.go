/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

//
//import (
//	"bufio"
//	"fmt"
//	"github.com/charmbracelet/log"
//	"net/http"
//	"os/exec"
//
//	"github.com/spf13/cobra"
//)
//
//// syncCmd represents the sync command
//var syncCmd = &cobra.Command{
//	Use:   "sync",
//	Short: "A brief description of your command",
//	Long: `A longer description that spans multiple lines and likely contains examples
//and usage of using your command. For example:
//
//Cobra is a CLI library for Go that empowers applications.
//This application is a tool to generate the needed files
//to quickly create a Cobra application.`,
//	Run: func(_ *cobra.Command, args []string) {
//		// aws s3 sync --delete C:\Users\looni\OneDrive\Documents\vault1 s3://lkat/obsidian-vault
//		log.Info("Syncing to S3...")
//		cmd := exec.Command("aws", "s3", "sync", "--delete", "C:\\Users\\looni\\OneDrive\\Documents\\vault1", "s3://lkat/obsidian-vault")
//		stdout, _ := cmd.StdoutPipe()
//		err := cmd.Start()
//		if err != nil {
//			panic(err)
//		}
//		scanner := bufio.NewScanner(stdout)
//		scanner.Split(bufio.ScanLines)
//		for scanner.Scan() {
//			m := scanner.Text()
//			fmt.Println(m)
//		}
//		err = cmd.Wait()
//		if err != nil {
//			panic(err)
//		}
//		log.Info("Kicking Kestra...")
//
//		//abcdefg
//
//		client := &http.Client{}
//		req, err := http.NewRequest(http.MethodGet, "http://server1.local:8090/api/v1/executions/webhook/dev/feedGenerateFromObsidianAdventures/abcdefg", nil)
//		if err != nil {
//			panic(err)
//		}
//		resp, err := client.Do(req)
//		if err != nil {
//			panic(err)
//		}
//		//resp.StatusCode == 200
//		//decoder := json.NewDecoder(resp.Body)
//		//var idkk string
//		//err = decoder.Decode(&idkk)
//		//if err != nil {
//		//	panic(err)
//		//}
//		log.Info("Kestra kicked successfully", "code", resp.Status)
//	},
//}
//
//func init() {
//	obsidianCmd.AddCommand(syncCmd)
//
//	// Here you will define your flags and configuration settings.
//
//	// Cobra supports Persistent Flags which will work for this command
//	// and all subcommands, e.g.:
//	// syncCmd.PersistentFlags().String("foo", "", "A help for foo")
//
//	// Cobra supports local flags which will only run when this command
//	// is called directly, e.g.:
//	// syncCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
//}
