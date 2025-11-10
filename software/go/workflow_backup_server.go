package shared

import (
	"bufio"
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"time"

	"go.temporal.io/sdk/workflow"
)

func GetGlobalConfig() {

}

func WorkflowBackupServer(ctx workflow.Context) error {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 8 * time.Hour,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)
	logger := workflow.GetLogger(ctx)

	pathsToBackup := []string{"/bigboy/temp", "/bigboy/nocodb", "/bigboy/memos",
		"/bigboy/immich", "/bigboy/minio", "/bigboy/miniflux", "/bigboy/obsidian", "/bigboy/gitea",
		"/bigboy/audiobookshelf/metadata", "/bigboy/audiobookshelf/config", "/bigboy/audiobookshelf/audiobooks",
		"/bigboy/old_videos/config",
		"/bigboy/old_videos/data",
		"/bigboy/postgres-backup",
	}

	for i, pathToBackup := range pathsToBackup {
		logger.Info(strconv.Itoa(i) + "/" + strconv.Itoa(len(pathsToBackup)) + " Backing up folder " + pathToBackup)
		var result string
		err := workflow.ExecuteActivity(ctx, BackupFolder, pathToBackup).Get(ctx, &result)

		if err != nil {
			logger.Error("Failed to backup folder "+pathToBackup, err)
			return err
		}
		logger.Info("Backed up folder " + pathToBackup)
	}

	return nil
}

func BackupFolder(folderToBackup string) (string, error) {
	cmd := exec.Command("restic", "backup", folderToBackup)
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr

	err := cmd.Run()

	if err != nil {
		fmt.Println(fmt.Sprint(err) + ": " + stderr.String())
		return "", err
	}
	return out.String(), nil
}

type ExecOnHostArgs struct {
	Name      string
	Args      []string
	Directory string
}

// func ExecOnHost(input ExecOnHostArgs) (string, error) {
// 	cmd := exec.Command(input.Name, input.Args...)
// 	var out bytes.Buffer
// 	var stderr bytes.Buffer
// 	cmd.Stdout = &out
// 	cmd.Stderr = &stderr
//
// 	err := cmd.Run()
//
// 	if err != nil {
// 		fmt.Println(fmt.Sprint(err) + ": " + stderr.String())
// 		return "", err
// 	}
// 	return out.String(), nil
// }

func ExecOnHost(input ExecOnHostArgs) (string, error) {
	cmd := exec.Command(input.Name, input.Args...)
	// cmd.Path = input.Path
	cmd.Dir = input.Directory

	stdoutPipe, _ := cmd.StdoutPipe()
	stderrPipe, _ := cmd.StderrPipe()

	if err := cmd.Start(); err != nil {
		return "", err
	}

	var buf bytes.Buffer

	go func() {
		scanner := bufio.NewScanner(stdoutPipe)
		for scanner.Scan() {
			line := scanner.Text()
			fmt.Println(line)            // stream live
			buf.WriteString(line + "\n") // capture
		}
	}()

	go func() {
		scanner := bufio.NewScanner(stderrPipe)
		for scanner.Scan() {
			line := scanner.Text()
			fmt.Fprintln(os.Stderr, line) // stream live errors
			buf.WriteString(line + "\n")
		}
	}()

	err := cmd.Wait()
	return buf.String(), err
}
