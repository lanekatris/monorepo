package shared

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/adrg/frontmatter"
	"github.com/charmbracelet/log"
	"github.com/minio/minio-go/v7"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/workflow"
	"gorm.io/gorm"
	"io"
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

//type Matter struct {
//	Situps  int `yaml:situps`
//	Pushups int `yaml:pushups`
//}

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

type Event struct {
	gorm.Model
	Id        int `json:"id" gorm:"unique;primaryKey;autoIncrement"`
	EventName string
	Data      sql.NullString
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
			Type    string   `yaml:type`
			Weight  float64  `yaml:weight`
		}
		rest, err := frontmatter.Parse(strings.NewReader(string(contents)), &EmptyMatter)
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

		fileContents := sql.NullString{String: string(rest), Valid: true}

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
	r := bytes.NewReader([]byte(value))

	mc := GetMinioClient()
	_, err := mc.PutObject(context.Background(), "etl", key, r, r.Size(), minio.PutObjectOptions{
		ContentType: "text/plain",
	})

	return err
}

func KvGetString(key string) (string, error) {
	mc := GetMinioClient()
	ctx := context.Background()

	// Check if the object exists
	_, err := mc.StatObject(ctx, "etl", key, minio.StatObjectOptions{})
	if err != nil {
		// If it's a "not found" error, return empty string and no error
		if minio.ToErrorResponse(err).Code == "NoSuchKey" {
			return "", nil // or return "", fmt.Errorf("object %q not found", objectKey)
		}
		return "", fmt.Errorf("failed to stat object: %w", err)
	}

	// Now that we know it exists, fetch the object
	object, err := mc.GetObject(ctx, "etl", key, minio.GetObjectOptions{})
	if err != nil {
		return "", fmt.Errorf("failed to get object: %w", err)
	}
	defer object.Close()

	var buf bytes.Buffer
	if _, err := io.Copy(&buf, object); err != nil {
		return "", fmt.Errorf("failed to read object: %w", err)
	}

	return buf.String(), nil
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

	// TODO: Make an argument or something better maybe...
	var filesPath = viper.GetString("OBSIDIAN_VAULT_ROOT")
	if filesPath == "" {
		return errors.New("Config not found: OBSIDIAN_VAULT_ROOT")
	}
	err = workflow.ExecuteActivity(ctx, SyncFolderMarkdownToDb, filesPath).Get(ctx, nil)
	return err
}
