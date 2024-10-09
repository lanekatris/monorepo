package shared

import (
	"context"
	"database/sql"
	"errors"
	"github.com/adrg/frontmatter"
	"github.com/lib/pq"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/workflow"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"io/fs"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type AdventureFile struct {
	Date         time.Time
	Activity     string
	FileContents string
	Tags         []string
	Path         string
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

	// Cold start of serverless DB can take a bit, lets increase our slow threshold
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second * 5, // Slow SQL threshold
			LogLevel:                  logger.Silent,   // Log level
			IgnoreRecordNotFoundError: true,            // Ignore ErrRecordNotFound error for logger
			ParameterizedQueries:      true,            // Don't include params in the SQL log
			Colorful:                  true,            // Disable color
		},
	)

	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&ObsidianAdventuretwo{}, &MarkdownFileModel{})
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
	Tags     pq.StringArray `gorm:"type:text[]"`
	Path     string
}

func (ObsidianAdventuretwo) TableName() string {
	return "kestra.obsidian_adventures"
}

func LoadObsidianAdventuresWorkflow(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}
	ctx = workflow.WithActivityOptions(ctx, options)

	var activities *ObsidianAdventuresActivityInput

	err := workflow.ExecuteActivity(ctx, activities.DeleteAdventureDataActivity).Get(ctx, nil)
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
}

func (input *ObsidianAdventuresActivityInput) DeleteAdventureDataActivity(ctx context.Context) error {
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
			adventures = append(adventures, AdventureFile{Date: date, Activity: activityName, FileContents: string(rest), Tags: matter.Tags, Path: path})
		}
		return nil
	})

	if err != nil {
		return nil, err
	}
	return adventures, nil
}

func (input *ObsidianAdventuresActivityInput) BulkInsert(ctx context.Context, unsavedRows []AdventureFile) error {
	models := make([]ObsidianAdventuretwo, len(unsavedRows))

	for i := 0; i < len(unsavedRows); i++ {
		models[i] = ObsidianAdventuretwo{
			Date:     unsavedRows[i].Date.Format("2006-01-02"),
			Activity: unsavedRows[i].Activity,
			Contents: unsavedRows[i].FileContents,
			Tags:     unsavedRows[i].Tags,
			Path:     unsavedRows[i].Path,
		}
	}

	result := input.GormDb.WithContext(ctx).Create(&models)
	return result.Error
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
