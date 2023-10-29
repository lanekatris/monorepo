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
			fmt.Println(info.Name(), info.Size())

			return nil
		})
		if err != nil {
			log.Println(err)
		}
	},
}
var dirSizeCmd = &cobra.Command{
	Use: "size",
	Run: func(cmd *cobra.Command, args []string) {
		s, err := DirSize(args[0])
		if err != nil {
			log.Println((err))
		}
		fmt.Println("Folder size: ", s)
	},
}

func DirSize(path string) (string, error) {
	var size int64
	err := filepath.Walk(path, func(_ string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			size += info.Size()
		}
		return err
	})
	return ByteCountSI(size), err
}

func ByteCountSI(b int64) string {
	const unit = 1000
	if b < unit {
		return fmt.Sprintf("%d B", b)
	}
	div, exp := int64(unit), 0
	for n := b / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB",
		float64(b)/float64(div), "kMGTPE"[exp])
}

func init() {
	rootCmd.AddCommand(jsonTestCmd)
	rootCmd.AddCommand(dirSizeCmd)
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
