package shared

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"github.com/adrg/frontmatter"
	"github.com/charmbracelet/log"
	"github.com/minio/minio-go/v7"
	"go.temporal.io/sdk/workflow"
	"gorm.io/gorm"
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type WorkflowMarkdownToDbInput struct {
	GormDb *gorm.DB
}

type Matter struct {
	Situps  int `yaml:situps`
	Pushups int `yaml:pushups`
}

func GetFilePaths(rootDir string) ([]string, error) {
	var paths []string
	err := filepath.Walk(rootDir, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() == false && strings.HasSuffix(info.Name(), ".md") {
			paths = append(paths, path)
		}
		return nil
	})
	return paths, err
}

type MarkdownFileModel struct {
	gorm.Model
	Id            int
	FileDate      string //date.Date
	FilePath      string
	FileContents  sql.NullString // string
	Meta          string         `gorm:"type:jsonb"`
	FileSizeBytes int64
}

func GenerateMarkdownModels(filePaths []string, rootPath string) ([]MarkdownFileModel, error) {

	var models []MarkdownFileModel
	for _, filePath := range filePaths {
		stat, err := os.Stat(filePath)
		if err != nil {
			return nil, err
		}

		contents, err := ioutil.ReadFile(filePath)
		if err != nil {
			return nil, err
		}

		var EmptyMatter struct {
			Situps  int      `yaml:situps`
			Pushups int      `yaml:pushups`
			Tags    []string `yaml:tags`
		}
		_, err = frontmatter.Parse(strings.NewReader(string(contents)), &EmptyMatter)
		if err != nil {
			return nil, err
		}

		baseFilename := filepath.Base(filePath)

		if len(baseFilename) < 11 {
			baseFilename = ""
		} else {
			_, err = time.Parse("2006-01-02", baseFilename[:10])
			if err == nil {
				baseFilename = baseFilename[:10]
			} else {
				baseFilename = ""
			}
		}

		meta, err := json.Marshal(EmptyMatter)
		if err != nil {
			return nil, err
		}

		fileContents := sql.NullString{String: string(contents), Valid: true}

		models = append(models, MarkdownFileModel{
			FileDate:      baseFilename,
			FilePath:      strings.Replace(filePath, rootPath, "", 1),
			FileContents:  fileContents,
			Meta:          string(meta), //sql.NullString{String: string(meta), Valid: true},
			FileSizeBytes: stat.Size(),
		})

	}
	return models, nil
}

func KvPut(key string, value string) error {
	//jsonBytes, err := json.Marshal(value)
	//if err != nil {
	//	return err
	//}

	r := bytes.NewReader([]byte(value))

	mc := GetMinioClient()
	_, err := mc.PutObject(context.Background(), "etl", key, r, r.Size(), minio.PutObjectOptions{
		ContentType: "text/plain",
	})

	return err
}

func TruncateTable(tableName string) error {
	db, err := GetGormDb()
	if err != nil {
		return err
	}

	result := db.Exec("truncate table " + tableName)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func SyncFolderMarkdownToDb(rootPath string) error {
	paths, err := GetFilePaths(rootPath)
	if err != nil {
		return err
	}

	models, err := GenerateMarkdownModels(paths, rootPath)
	if err != nil {
		return err
	}

	db, err := GetGormDb()
	if err != nil {
		return err
	}

	result := db.Create(&models)
	log.Info("Done pushing files to DB", "created", result.RowsAffected)

	return result.Error

}

func WorkflowMarkdownToDb(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}
	ctx = workflow.WithActivityOptions(ctx, options)

	err := workflow.ExecuteActivity(ctx, TruncateTable, "public.markdown_file_models").Get(ctx, nil)

	err = workflow.ExecuteActivity(ctx, SyncFolderMarkdownToDb, "/home/lane/Documents/lkat-vault/").Get(ctx, nil)
	return err
}
