package main

import (
	"context"
	"fmt"
	"github.com/spf13/cobra"
	"google.golang.org/grpc"
	"io/fs"
	pb "lkat/pkg/pb"
	"log"
	"os"
	"path/filepath"
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

var jsonTestCmd = &cobra.Command{
	Use:   "ls",
	Short: "Looks at markdown files and creates json as events",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("This is where I ls the dir")
		err := filepath.Walk(args[0], func(path string, info fs.FileInfo, err error) error {
			if err != nil {
				return err
			}
			fmt.Println(path, info.Size())
			return nil
		})
		if err != nil {
			log.Println(err)
		}
	},
}

func init() {
	rootCmd.AddCommand(jsonTestCmd)
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "Whoops. There was an error while executing your CLI '%s'", err)
		os.Exit(1)
	}
}

func main() {
	//fmt.Println("Im supposed to be the client ha")
	//ctx := context.Background()
	Execute()
	//rootCmd.AddCommand(jsonTestCmd)
}
