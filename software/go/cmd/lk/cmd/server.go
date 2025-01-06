/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"fmt"
	"github.com/charmbracelet/log"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/teris-io/shortid"
	"go.temporal.io/sdk/client"
	"google.golang.org/grpc"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"shared"
	"shared/pkg/pb"

	"github.com/spf13/cobra"
)

type ServerIdk struct {
	pb.LkatServiceServer
}

func (s *ServerIdk) Ping(ctx context.Context, in *pb.PingRequest) (*pb.PongResponse, error) {
	fmt.Println("recieved ping request: " + in.WhoAmI)
	return &pb.PongResponse{Idk: "hi there " + in.WhoAmI}, nil
}

func fileCount(path string) (int, error) {
	i := 0
	files, err := ioutil.ReadDir(path)
	if err != nil {
		return 0, err
	}
	for _, file := range files {
		if !file.IsDir() {
			i++
		}
	}
	return i, nil
}

func isLinux() bool {
	return runtime.GOOS == "linux"
}

// serverCmd represents the server command
var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		//db, err := shared.GetGormDb()
		//if err != nil {
		//	panic(err)
		//}

		r := gin.Default()
		r.Use(cors.Default())
		r.GET("/", func(c *gin.Context) {
			c.String(200, "Welcome to lkat API!")
		})
		r.GET("/ping", func(c *gin.Context) {
			obsidianPath := "C:\\Users\\looni\\OneDrive\\Documents\\vault1"
			if isLinux() {
				obsidianPath = "/home/lane/Documents/lkat-vault"
			}
			obsidianFiles, _ := fileCount(obsidianPath)
			videos, _ := os.ReadDir("E:\\video-temp")

			c.JSON(200, gin.H{
				"fileCounts": gin.H{
					"obsidianVaultRoot": obsidianFiles,
					"videosToProcess":   len(videos),
				},
				"seperator": obsidianPath,
			})
		})

		r.GET("/sleep", func(c *gin.Context) {
			var cmd *exec.Cmd
			if isLinux() {
				cmd = exec.Command("systemctl", "suspend")
			} else {
				cmd = exec.Command("rundll32.exe", "powrprof.dll,SetSuspendState", "0,1,0")
			}
			if err := cmd.Run(); err != nil {
				c.JSON(500, err)
			}

			c.JSON(200, "success")
		})

		r.GET("/nvidia", func(c *gin.Context) {
			out, err := exec.Command("C:\\MyPrograms\\graphics-info\\Lkat.CLI.exe").Output()
			if err != nil {
				c.JSON(500, err)
			}
			c.Data(http.StatusOK, "application/json", out)
		})

		r.GET("/recent-gym-users", func(c *gin.Context) {
			cmd := exec.Command("npm", "start")
			cmd.Dir = "/home/lane/git/monorepo/software/rhinofit-recent-users"
			out, err := cmd.Output()
			if err != nil {
				c.JSON(500, err)
			}
			c.Data(http.StatusOK, "application/json", out)
		})

		r.GET("/udisc-scorecards", func(c *gin.Context) {
			cmd := exec.Command("npm", "run", "scorecards")
			cmd.Dir = "/home/lane/git/monorepo/software/js"
			out, err := cmd.Output()
			if err != nil {
				c.JSON(500, err)
			}
			c.Data(http.StatusOK, "application/json", out)
		})

		// raindrop
		r.GET("/raindrop-io", func(c *gin.Context) {
			cmd := exec.Command("npm", "start")
			cmd.Dir = "/home/lane/git/monorepo/software/bookmark-io"
			out, err := cmd.Output()
			if err != nil {
				c.JSON(500, err)
			}
			c.Data(http.StatusOK, "application/json", out)
		})

		// disc list
		r.GET("/disc-list", func(c *gin.Context) {
			cmd := exec.Command("npm", "start")
			cmd.Dir = "/home/lane/git/monorepo/software/disc-list"
			out, err := cmd.Output()
			if err != nil {
				c.JSON(500, err)
			}
			c.Data(http.StatusOK, "application/json", out)
		})

		// update obsidian client
		r.GET("/deploy-obsidian-client", func(c *gin.Context) {
			//cmd := exec.Command("cp", "/home/lane/git/monorepo/software/obsidian-client/obsidian-client.js", "/home/lane/Documents/lkat-vault/_admin/Scripts/")
			//out, err := cmd.Output()
			//if err != nil {
			//	c.JSON(500, err)
			//}
			//c.Data(http.StatusOK, "application/json", out)
			cmd := exec.Command("npx", "nx", "build", "obsidian-client")
			cmd.Dir = shared.GetPath("/home/lane/git/monorepo/software/js", "C:\\Code\\monorepo\\software\\js")
			output, err := cmd.Output()
			if err != nil {
				log.Error(string(output))
				log.Error(err)
				c.JSON(500, err)
				return
			}
			cmd = exec.Command("cp", shared.GetPath("/home/lane/git/monorepo/software/js/dist/packages/obsidian-client/main.js", "C:\\Code\\monorepo\\software\\js\\dist\\packages\\obsidian-client\\main.js"), shared.GetPath("/home/lane/Documents/lkat-vault/_admin/Scripts/obsidian-client.js", "C:\\Users\\looni\\vault1\\_admin\\Scripts\\obsidian-client.js"))
			output, err = cmd.Output()
			if err != nil {
				log.Error(string(output))
				log.Error(err)
				c.JSON(500, err)
				return
			}
			c.JSON(200, "success")
		})

		r.GET("/deploy-markdown", func(c *gin.Context) {
			cc, err := client.Dial(client.Options{
				HostPort: "192.168.86.100:7233",
			})
			if err != nil {
				log.Error("unable to create Temporal client", err)
				return

			}
			defer cc.Close()

			options := client.StartWorkflowOptions{
				//ID:        "obsidian-theme-workflow",
				ID:        "api-kick-deploy-markdown",
				TaskQueue: "server",
			}

			we, err := cc.ExecuteWorkflow(context.Background(), options, shared.WorkflowMarkdownToDb)
			if err != nil {
				log.Error("unable to complete Workflow", err)
				return
			}

			err = we.Get(context.Background(), nil)
			if err != nil {
				log.Error("unable to complete Workflow2222", err)
				return
			}
			c.JSON(200, "success")
		})

		r.GET("/deploy-blog", func(c *gin.Context) {
			if isLinux() {
				cmd, err := exec.Command("/bin/sh", "/home/lane/git/monorepo/scripts/sync-brain.sh").Output()
				if err != nil {
					c.JSON(500, err)
				}
				c.Data(http.StatusOK, "application/json", cmd)
			} else {
				cmd, err := exec.Command("powershell", "C:\\Code\\monorepo\\scripts\\sync-brain.ps1").Output()
				if err != nil {
					c.JSON(500, err)
				}
				c.Data(http.StatusOK, "application/json", cmd)
			}

		})

		r.GET("/disable-monitors", func(c *gin.Context) {
			cmd, err := exec.Command("disable-monitors.sh").Output()
			if err != nil {
				c.JSON(500, err)
			} else {

				c.Data(http.StatusOK, "application/json", cmd)
			}
		})
		r.GET("/enable-monitors", func(c *gin.Context) {
			cmd, err := exec.Command("enable-monitors.sh").Output()
			if err != nil {
				c.JSON(500, err)
			}
			c.Data(http.StatusOK, "application/json", cmd)
		})

		r.GET("/testies", func(c *gin.Context) {
			//var connStr = viper.GetString(shared.ResendApiKeyConfig)
			//if connStr == "" {
			//	panic("Config not found: " + shared.ResendApiKeyConfig)
			//}
			//dumper := shared.WorkflowInputDumper{
			//	Db:          db,
			//	EmailClient: shared.NewResendClient(connStr),
			//	EventService: &shared.DbEventService{
			//		Db: db,
			//	},
			//}
			//var data = shared.WaterLevelData{
			//	Data: 3,
			//}
			//stringified, err := json.Marshal(data)
			//if err != nil {
			//	log.Error(err)
			//	return
			//}
			//err = dumper.ProcessEvent("water_level_v1", string(stringified))
			//if err != nil {
			//	log.Error(err)
			//	return
			//}
			//err = dumper.DumpEvent("water_level_v1", string(stringified))
			//if err != nil {
			//	log.Error(err)
			//	return
			//}

			c.JSON(200, gin.H{
				"hello": "world",
				"ugh":   shared.WaterLevel.String(),
				//"e":     event,
				//"two":   event.Id,
				//"three": shared.IsWithin24Hours(event.CreatedAt),
			})
		})

		r.GET("/obsidian-adventure-sync", func(cc *gin.Context) {
			c, err := client.Dial(client.Options{
				//HostPort: "server1.local:7233",
				HostPort: "192.168.86.100:7233", // need to use ip address when within a docker image
			})
			if err != nil {
				//fmt.Errorf(err)
				log.Fatal(err)
				cc.JSON(500, err)
				return
			}
			defer c.Close()

			id, err := shortid.Generate()
			if err != nil {
				log.Fatal(err)
				cc.JSON(500, err)
			}

			options := client.StartWorkflowOptions{
				ID:        "obsidian-adventures-sync-" + id,
				TaskQueue: shared.GreetingTaskQueue,
			}

			_, err = c.ExecuteWorkflow(context.Background(), options, shared.LoadObsidianAdventuresWorkflow)
			if err != nil {
				log.Fatal(err)
				cc.JSON(500, err)
				return
			}
			cc.JSON(200, "success")
		})

		go r.Run() // listen and serve on 0.0.0.0:8080

		lis, err := net.Listen("tcp", ":8081")
		if err != nil {
			//log.Fatalf("failed to listen %v", err)
			panic(err)
		}

		fmt.Println("Firing up grpc...")

		//s := Server{}
		//s := grpc.NewServer()

		grpcServer := grpc.NewServer()
		pb.RegisterLkatServiceServer(grpcServer, &ServerIdk{})
		//grpcServer.RegisterService(s)
		//err := go grpcServer.Serve(lis)

		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("failed to listen %v", err)
		}
		fmt.Println("Grpc listening on 8081")
	},
}

func init() {
	rootCmd.AddCommand(serverCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// serverCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// serverCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
