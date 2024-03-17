package shared

import (
	"testing"
)

func TestStartMe(t *testing.T) {
	db, err := GetDb()
	HandleError(err)

	err = DeleteAdventureData(db)
	HandleError(err)

	adventures := GetAdventureFiles()
	err = BulkInsert(adventures, db)
	HandleError(err)
	if len(adventures) == 0 {
		t.Error("should have found something")
	}

	err = DeleteFromFeedByType("obsidian-adventure", db)
	HandleError(err)
	err = PopulateFeedFromAdventures(db)
	HandleError(err)
}
