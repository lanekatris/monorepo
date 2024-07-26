package shared

import (
	"testing"
)

func TestMinifluxToS3WorkflowHappyPath(t *testing.T) {
	db, err := GetMinifluxDb()
	HandleError(err)

	var client = GetMinioClient()

	var activities = &WorkflowInputMinifluxToS3{Db: db, StorageClient: client}

	feeds, err := activities.GetRssFeeds()

	if len(feeds) == 0 {
		t.Error("should have feeds")
	}

	err = activities.UploadFile(feeds)
	if err != nil {
		t.Error(err)
	}

	//jsonBytes, err := json.Marshal(feeds)
	//HandleError(err)
	//r := bytes.NewReader(jsonBytes)
	//
	//info, err := client.PutObject(context.Background(), "etl", "miniflux_dump.json", r, r.Size(), minio.PutObjectOptions{
	//	ContentType: "application/json",
	//})
	//HandleError(err)
	//
	//if info.Size == 0 {
	//	t.Error("should have info")
	//}
}
