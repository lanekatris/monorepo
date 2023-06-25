package main

import (
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"runtime"
)

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
	r.GET("/ping", func(c *gin.Context) {
	obsidianPath := "C:\\Users\\looni\\OneDrive\\Documents\\vault1"
	if (isLinux()) {
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
		cmd := exec.Command("rundll32.exe", "powrprof.dll,SetSuspendState", "0,1,0")
		if err := cmd.Run(); err != nil {
			//log.Fatal(err)
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

	r.Run() // listen and serve on 0.0.0.0:8080
}
