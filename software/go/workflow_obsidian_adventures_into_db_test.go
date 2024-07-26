package shared

//func WorkflowObsidianAdventuresIntoDbHappyPath(t *testing.T) {
//	db, err := GetDb()
//	HandleError(err)
//
//	var activities = &ObsidianAdventuresActivityInput{Db: db}
//
//	err = activities.DeleteAdventureDataActivity()
//	HandleError(err)
//
//	adventures, err := activities.GetAdventureFiles()
//	HandleError(err)
//
//	err = activities.BulkInsert(adventures)
//	HandleError(err)
//
//	if len(adventures) == 0 {
//		t.Error("should have found something")
//	}
//
//	err = activities.DeleteFromFeedByType("obsidian-adventure")
//	HandleError(err)
//
//	err = activities.PopulateFeedFromAdventures()
//	HandleError(err)
//}
