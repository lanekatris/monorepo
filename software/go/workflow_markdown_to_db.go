package shared

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"github.com/adrg/frontmatter"
	"gorm.io/gorm"
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type WorkflowMarkdownToDbInput struct {
	//Db     *sql.DB
	GormDb *gorm.DB
	//Ctx    context.Context
}

type Matter struct {
	Situps  int `yaml:situps`
	Pushups int `yaml:pushups`
}

func GetFilePaths(rootDir string) (error, []string) {
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
	return err, paths
}

type JSONB map[string]interface{}

// Value Marshal
func (jsonField JSONB) Value() (driver.Value, error) {
	return json.Marshal(jsonField)
}

// Scan Unmarshal
func (jsonField *JSONB) Scan(value interface{}) error {
	data, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(data, &jsonField)
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

func GenerateMarkdownModels(filePaths []string, rootPath string) (error, []MarkdownFileModel) {

	var models []MarkdownFileModel
	for _, filePath := range filePaths {
		//date, err := time.Parse("2006-01-02", filepath.Base(filePath)[:10])
		//if err != nil {return err, nil}

		stat, err := os.Stat(filePath)
		if err != nil {
			return err, nil
		}

		contents, err := ioutil.ReadFile(filePath)
		if err != nil {
			return err, nil
		}

		//var emptyMatter struct{}
		var EmptyMatter struct {
			Situps  int      `yaml:situps`
			Pushups int      `yaml:pushups`
			Tags    []string `yaml:tags`
		}
		_, err = frontmatter.Parse(strings.NewReader(string(contents)), &EmptyMatter)
		if err != nil {
			return err, nil
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
			return err, nil
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
	return nil, models
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
