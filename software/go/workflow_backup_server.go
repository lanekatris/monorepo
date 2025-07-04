package shared

import (
	"bytes"
	"fmt"
	"go.temporal.io/sdk/workflow"
	"os/exec"
	"strconv"
	"time"
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
	Name string
	Args []string
}

func ExecOnHost(input ExecOnHostArgs) (string, error) {
	cmd := exec.Command(input.Name, input.Args...)
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
