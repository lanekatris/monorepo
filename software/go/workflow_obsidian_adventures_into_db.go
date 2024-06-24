package shared

import (
	"context"
	"database/sql"
	"errors"
	"github.com/adrg/frontmatter"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/workflow"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"io/fs"
	"io/ioutil"
	"path/filepath"
	"strings"
	"time"
)

type AdventureFile struct {
	Date         time.Time
	Activity     string
	FileContents string
	Tags         []string
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

func GetGormDb() (*gorm.DB, error) {
	SetupViper()
	var connStr = viper.GetString(PostgresApiKeyConfig)
	if connStr == "" {
		return nil, errors.New("config not found: " + PostgresApiKeyConfig)
	}

	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&ObsidianAdventuretwo{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

type ObsidianAdventuretwo struct {
	gorm.Model
	Id uint
	//Index    int64
	Date     string
	Activity string

	Contents string
	Tags     []string `gorm:"type:text[]"`
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

	gormDb, err := GetGormDb()
	if err != nil {
		return err
	}

	//gormDb.WithContext(ctx)

	var activities = ObsidianAdventuresActivityInput{Db: db, GormDb: gormDb}

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
	Db     *sql.DB
	GormDb *gorm.DB
	//Ctx    context.Context
}

func (input *ObsidianAdventuresActivityInput) DeleteAdventureDataActivity() error {
	_, err := input.Db.Exec("delete from kestra.obsidian_adventures")
	return err
}

func (input *ObsidianAdventuresActivityInput) GetAdventureFiles() ([]AdventureFile, error) {
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
			contents, err := ioutil.ReadFile(path)
			HandleError(err)
			var matter struct {
				Tags []string `yaml:"tags" toml:"tags" json:"tags"`
			}
			rest, err := frontmatter.Parse(strings.NewReader(string(contents)), &matter)
			HandleError(err)
			adventures = append(adventures, AdventureFile{Date: date, Activity: activityName, FileContents: string(rest), Tags: matter.Tags})
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return adventures, nil
}

func (input *ObsidianAdventuresActivityInput) BulkInsert(ctx context.Context, unsavedRows []AdventureFile) error {
	//valueStrings := make([]string, 0, len(unsavedRows))
	//valueArgs := make([]interface{}, 0, len(unsavedRows)*3)
	//i := 0
	//for _, post := range unsavedRows {
	//	valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d)", i*3+1, i*3+2, i*3+3))
	//	valueArgs = append(valueArgs, post.Date.Format("2006-01-02"))
	//	valueArgs = append(valueArgs, post.Activity)
	//	valueArgs = append(valueArgs, post.FileContents)
	//	//valueArgs = append(valueArgs, pq.Array(post.Tags))
	//	//valueArgs = append(valueArgs, post.Column3)
	//	i++
	//}
	//stmt := fmt.Sprintf("INSERT INTO kestra.obsidian_adventures (date, activity, contents) VALUES %s", strings.Join(valueStrings, ","))
	//
	//_, err := input.Db.Exec(stmt, valueArgs...)

	models := make([]ObsidianAdventuretwo, len(unsavedRows))
	for _, file := range unsavedRows {
		models = append(models, ObsidianAdventuretwo{
			Date:     file.Date.Format("2006-01-02"),
			Activity: file.Activity,
			Contents: file.FileContents,
			Tags:     file.Tags,
		})
	}

	result := input.GormDb.WithContext(ctx).Create(&models)
	return result.Error

	//return err
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
