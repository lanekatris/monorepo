package shared

import (
	"bytes"
	"fmt"
	"go.temporal.io/sdk/workflow"
	"os/exec"
	"strconv"
	"time"
)

func WorkflowBackupServer(ctx workflow.Context) error {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 8 * time.Hour,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)
	logger := workflow.GetLogger(ctx)

	pathsToBackup := []string{"/bigboy/temp", "/home/lane/memos", "/bigboy/immich", "/bigboy/minio", "/bigboy/miniflux"}

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
	//return ExecOnHost("restic", "backup", folderToBackup)
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