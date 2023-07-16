package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"strconv"
	"time"
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
	r.Use(cors.Default())
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
	r.GET("/inbox/submit", func(c *gin.Context) {
		url := c.Query("url")

		folder := "/home/lane/Documents/lkat-vault/"
		datePrefix := time.Now().Format("2006-01-02")
		unixDate := strconv.FormatInt(time.Now().Unix(), 10)
		fileName := datePrefix + " Read Later - " + unixDate + ".md"
		fullPath := folder + fileName

		noteBody := []byte(url)
		err := os.WriteFile(fullPath, noteBody, 0644)
		if err != nil {
			c.JSON(500, err)
		}

		c.JSON(http.StatusOK, fullPath)
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}
