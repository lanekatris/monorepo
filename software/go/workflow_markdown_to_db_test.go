package shared

import (
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
	//paths, err := GetFilePaths("/home/lane/Documents/lkat-vault/")
	//if err != nil {
	//	t.Error(err)
	//}
	//
	//models, err := GenerateMarkdownModels(paths, "/home/lane/Documents/lkat-vault/")
	//if err != nil {
	//	t.Error(err)
	//}
	//
	//b, err := json.Marshal(models[0])
	//t.Log(string(b))
	//
	////db, err := GetGormDb()
	////if err != nil {
	////	t.Error(err)
	////}
	////result := db.Create(&models)
	////if result.Error != nil {
	////	t.Error(result.Error)
	////}
	////t.Log(result.RowsAffected)
	//result, err := InsertMultipleIntoDb(&models)
	//if err != nil || result.Error != nil {
	//	t.Error(result.Error)
	//}
	//t.Log(result.RowsAffected)

	err := TruncateTable("public.markdown_file_models")
	if err != nil {
		t.Error(err)
	}

	err = SyncFolderMarkdownToDb("/home/lane/Documents/lkat-vault/")
	if err != nil {
		t.Error(err)
	}
}
