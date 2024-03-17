package shared

import (
	"database/sql"
	"errors"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
	"io/fs"
	"path/filepath"
	"strings"
	"time"
)

type AdventureFile struct {
	Date     time.Time
	Activity string
}

func GetAdventureFiles() []AdventureFile {
	filesPath := GetPath("/home/lane/Documents/lkat-vault/Adventures", "C:\\Users\\looni\\vault1\\Adventures")

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

	HandleError(err)
	return adventures
}

func BulkInsert(unsavedRows []AdventureFile, db *sql.DB) error {
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

	_, err := db.Exec(stmt, valueArgs...)

	return err
}

func DeleteFromFeedByType(t string, db *sql.DB) error {
	_, err := db.Exec("delete from noco.feed where type = $1", t)
	return err
}

func PopulateFeedFromAdventures(db *sql.DB) error {
	_, err := db.Exec("insert into noco.feed(type, remote_id_int)" +
		"select 'obsidian-adventure', id from kestra.obsidian_adventures")
	return err
}

func GetDb() (*sql.DB, error) {
	SetupViper()
	var connStr = viper.GetString(PostgresApiKeyConfig)
	if connStr == "" {
		return nil, errors.New("Config not found: " + PostgresApiKeyConfig)
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func DeleteAdventureData(db *sql.DB) error {
	_, err := db.Exec("delete from kestra.obsidian_adventures")
	return err
}
