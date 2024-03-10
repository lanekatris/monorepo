package main

import (
	"context"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"shared/pkg/pb"
	//"lanekatris.com/lkat"
	"log"
	"net"
	"runtime"
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

func main() {
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
		cmd := exec.Command("node_modules/.bin/nx", "build", "obsidian-client")
		cmd.Dir = "/home/lane/git/monorepo/software/js"
		_, err := cmd.Output()
		if err != nil {
			c.JSON(500, err)
		}
		cmd = exec.Command("cp", "/home/lane/git/monorepo/software/js/dist/packages/obsidian-client/main.js", "/home/lane/Documents/lkat-vault/_admin/Scripts/obsidian-client.js")
		_, err = cmd.Output()
		if err != nil {
			c.JSON(500, err)
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
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}
