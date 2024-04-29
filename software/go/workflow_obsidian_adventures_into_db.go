package shared

import (
	"database/sql"
	"errors"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/workflow"
	"io/fs"
	"path/filepath"
	"strings"
	"time"
)

type AdventureFile struct {
	Date     time.Time
	Activity string
}

func GetDb() (*sql.DB, error) {
	SetupViper()
	var connStr = viper.GetString(PostgresApiKeyConfig)
	if connStr == "" {
		return nil, errors.New("config not found: " + PostgresApiKeyConfig)
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func LoadObsidianAdventuresWorkflow(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}
	ctx = workflow.WithActivityOptions(ctx, options)

	db, err := GetDb()
	if err != nil {
		return err
	}

	var activities = ObsidianAdventuresActivityInput{Db: db}

	err = workflow.ExecuteActivity(ctx, activities.DeleteAdventureDataActivity).Get(ctx, nil)
	if err != nil {
		return err
	}

	var adventures []AdventureFile
	err = workflow.ExecuteActivity(ctx, activities.GetAdventureFiles).Get(ctx, &adventures)
	if err != nil {
		return err
	}

	err = workflow.ExecuteActivity(ctx, activities.BulkInsert, adventures).Get(ctx, nil)
	if err != nil {
		return err
	}

	err = workflow.ExecuteActivity(ctx, activities.DeleteFromFeedByType, "obsidian-adventure").Get(ctx, nil)
	if err != nil {
		return err
	}

	err = workflow.ExecuteActivity(ctx, activities.PopulateFeedFromAdventures).Get(ctx, nil)
	if err != nil {
		return err
	}

	return err
}

type ObsidianAdventuresActivityInput struct {
	Db *sql.DB
}

func (input *ObsidianAdventuresActivityInput) DeleteAdventureDataActivity() error {
	_, err := input.Db.Exec("delete from kestra.obsidian_adventures")
	return err
}

func (input *ObsidianAdventuresActivityInput) GetAdventureFiles() ([]AdventureFile, error) {
	//filesPath := GetPath("/home/lane/Documents/lkat-vault/Adventures", "C:\\Users\\looni\\vault1\\Adventures")
	var filesPath = viper.GetString("OBSIDIAN_VAULT_ROOT")
	if filesPath == "" {
		panic("Config not found: OBSIDIAN_VAULT_ROOT")
	}
	filesPath = filepath.Join(filesPath, "Adventures")

	var adventures []AdventureFile
	adventureDateFormat := "2006-01-02"
	err := filepath.Walk(filesPath, func(path string, info fs.FileInfo, err error) error {
		HandleError(err)
		if info.IsDir() == false {
			date, err := time.Parse(adventureDateFormat, info.Name()[:10])
			HandleError(err)

			activityName := strings.ReplaceAll(strings.ToLower(strings.TrimSpace(info.Name()[10:])), ".md", "")
			adventures = append(adventures, AdventureFile{Date: date, Activity: activityName})
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return adventures, nil
}

func (input *ObsidianAdventuresActivityInput) BulkInsert(unsavedRows []AdventureFile) error {
	valueStrings := make([]string, 0, len(unsavedRows))
	valueArgs := make([]interface{}, 0, len(unsavedRows)*2)
	i := 0
	for _, post := range unsavedRows {
		valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d)", i*2+1, i*2+2))
		valueArgs = append(valueArgs, post.Date.Format("2006-01-02"))
		valueArgs = append(valueArgs, post.Activity)
		//valueArgs = append(valueArgs, post.Column3)
		i++
	}
	stmt := fmt.Sprintf("INSERT INTO kestra.obsidian_adventures (date, activity) VALUES %s", strings.Join(valueStrings, ","))

	_, err := input.Db.Exec(stmt, valueArgs...)

	return err
}

func (input *ObsidianAdventuresActivityInput) DeleteFromFeedByType(t string) error {
	_, err := input.Db.Exec("delete from noco.feed where type = $1", t)
	return err
}

func (input *ObsidianAdventuresActivityInput) PopulateFeedFromAdventures() error {
	_, err := input.Db.Exec("insert into noco.feed(type, remote_id_int)" +
		"select 'obsidian-adventure', id from kestra.obsidian_adventures")
	return err
}
