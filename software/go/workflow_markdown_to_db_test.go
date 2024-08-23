package shared

import (
	"github.com/goccy/go-json"
	"testing"
)

func TestGettingPaths(t *testing.T) {
	err, paths := GetFilePaths("/home/lane/Documents/lkat-vault/")
	if err != nil {
		t.Error(err)
	}
	t.Log(paths)
}

func TestGettingPaths2(t *testing.T) {
	err, paths := GetFilePaths("/home/lane/Documents/lkat-vault/")
	if err != nil {
		t.Error(err)
	}

	err, models := GenerateMarkdownModels(paths, "/home/lane/Documents/lkat-vault/")
	if err != nil {
		t.Error(err)
	}

	b, err := json.Marshal(models[0])
	t.Log(string(b))

	db, err := GetGormDb()
	if err != nil {
		t.Error(err)
	}
	result := db.Create(&models)
	if result.Error != nil {
		t.Error(result.Error)
	}
	t.Log(result.RowsAffected)
}
