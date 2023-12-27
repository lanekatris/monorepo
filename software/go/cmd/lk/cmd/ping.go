/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	pb "shared/pkg/pb"

	"github.com/spf13/cobra"
)

// pingCmd represents the ping command
var pingCmd = &cobra.Command{
	Use:   "ping",
	Short: "Sees if the server is running",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("This is where I call swagger or grpc")
		opts := grpc.WithInsecure()
		cc, err := grpc.Dial("localhost:8081", opts)
		if err != nil {
			panic(err)
		}
		defer cc.Close()
		client := pb.NewLkatServiceClient(cc)
		request := &pb.PingRequest{WhoAmI: "Lane from lk"}

		resp, err := client.Ping(context.TODO(), request)
		if err != nil {
			panic(err)
		}
		fmt.Println(resp)
	},
}

func init() {
	rootCmd.AddCommand(pingCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// pingCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// pingCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
