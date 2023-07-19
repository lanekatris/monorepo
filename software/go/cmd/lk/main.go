package main

import (
	"context"
	"fmt"
	"github.com/spf13/cobra"
	"google.golang.org/grpc"
	"lkat/pb"
)

var rootCmd = &cobra.Command{
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

func Execute() error {
	//ctx := context.TODO()
	return rootCmd.Execute()
}

func main() {
	//fmt.Println("Im supposed to be the client ha")
	//ctx := context.Background()
	Execute()
}
