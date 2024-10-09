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

type JSONB map[string]interface{}

// Value Marshal
//func (jsonField JSONB) Value() (driver.Value, error) {
//	return json.Marshal(jsonField)
//}
//
//// Scan Unmarshal
//func (jsonField *JSONB) Scan(value interface{}) error {
//	data, ok := value.([]byte)
//	if !ok {
//		return errors.New("type assertion to []byte failed")
//	}
//	return json.Unmarshal(data, &jsonField)
//}

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
		//date, err := time.Parse("2006-01-02", filepath.Base(filePath)[:10])
		//if err != nil {return err, nil}

		stat, err := os.Stat(filePath)
		if err != nil {
			return nil, err
		}

		contents, err := ioutil.ReadFile(filePath)
		if err != nil {
			return nil, err
		}

		//var emptyMatter struct{}
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
			//baseFilename = baseFilename[:10]
		}

		meta, err := json.Marshal(EmptyMatter)
		if err != nil {
			return nil, err
		}

		//if !noMeta {
		//	//fileContents.Valid = false
		//	//meta.Valid = false
		//	//fileContents = sql.NullString{String: string(contents), Valid: true}
		//	meta = sql.NullString{String: string(rest), Valid: true}
		//}

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

//func GormBulkInsert(db *gorm.DB, models []gorm.Model){
//	result := db.Create(&models)
//	return result
//}

//func WorkflowMarkdownToDb(ctx workflow.Context) error {
//	options := workflow.ActivityOptions{
//		StartToCloseTimeout: time.Minute * 1,
//	}
//	ctx = workflow.WithActivityOptions(ctx, options)
//
//	//db, err := GetDb()
//	//if err != nil {
//	//	return err
//	//}
//
//	gormDb, err := GetGormDb()
//	if err != nil {
//		return err
//	}
//
//	var activities = WorkflowMarkdownToDbInput{GormDb: gormDb}
//
//	var filePaths []string
//	err = workflow.ExecuteActivity(ctx, activities.GetFilePaths()).Get(ctx, &adventures)
//	if err != nil {
//		return err
//	}
//}

func InsertMultipleIntoDb(value interface{}) (*gorm.DB, error) {
	db, err := GetGormDb()
	if err != nil {
		return nil, err
	}

	result := db.Create(value)
	if result.Error != nil {
		return nil, result.Error
	}
	return result, nil
}

func KvPut(key string, value interface{}) error {
	jsonBytes, err := json.Marshal(value)
	if err != nil {
		return err
	}

	r := bytes.NewReader(jsonBytes)

	mc := GetMinioClient()
	_, err = mc.PutObject(context.Background(), "kv", key, r, r.Size(), minio.PutObjectOptions{
		ContentType: "application/json",
	})

	return err
}

func GetAndPersistFilePaths(rootPath string) error {
	paths, err := GetFilePaths("/home/lane/Documents/lkat-vault/")
	if err != nil {
		return err
	}

	err = KvPut("blah", paths)
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

	var rootPath = "/home/lane/Documents/lkat-vault/"
	err = workflow.ExecuteActivity(ctx, SyncFolderMarkdownToDb, rootPath).Get(ctx, nil)
	return err
}

//func WorkflowMarkdownToDb(ctx workflow.Context) (int64, error) {
//	options := workflow.ActivityOptions{
//		StartToCloseTimeout: time.Minute * 1,
//	}
//	ctx = workflow.WithActivityOptions(ctx, options)
//
//	var rootPath = "/home/lane/Documents/lkat-vault/"
//
//	//var paths []string
//	err := workflow.ExecuteActivity(ctx, GetAndPersistFilePaths, rootPath).Get(ctx, nil)
//	if err != nil {
//		return 0, err
//	}
//
//	//paths, err := GetFilePaths(rootPath)
//	//if err != nil {
//	//	return nil, err
//	//}
//
//	//var models []MarkdownFileModel
//	//err = workflow.ExecuteActivity(ctx, GenerateMarkdownModels, paths, rootPath).Get(ctx, &models)
//	//if err != nil {
//	//	return err
//	//}
//	models, err := GenerateMarkdownModels(paths, rootPath)
//	if err != nil {
//		return nil, err
//	}
//	//var db *gorm.DB
//	//err = workflow.ExecuteActivity(ctx, GetGormDb).Get(ctx, &db)
//	//if err != nil {
//	//	return err
//	//}
//
//	//var result *gorm.DB
//	//err = workflow.ExecuteActivity(ctx, InsertMultipleIntoDb, models).Get(ctx, &result)
//
//	result, err := InsertMultipleIntoDb(&models)
//	if err != nil {
//		return nil, err
//	}
//
//	return result, nil
//
//	//return err
//}
