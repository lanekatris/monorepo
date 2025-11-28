package shared

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/workflow"
	"time"
)

const MinifluxPostgresConnString = "MINIFLUX_POSTGRES_CONN"

type WorkflowInputMinifluxToS3 struct {
	Db            *sql.DB
	StorageClient *minio.Client
}

func GetMinifluxDb() (*sql.DB, error) {
	SetupViper()
	var connStr = viper.GetString(MinifluxPostgresConnString)
	if connStr == "" {
		return nil, errors.New("config not found: " + MinifluxPostgresConnString)
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func GetMinioClient() *minio.Client {
	SetupViper()
	endpoint := "100.97.86.67:9000"
	accessKeyID := viper.GetString("MINIO_ACCESS_KEY")
	secretAccessKey := viper.GetString("MINIO_SECRET")

	// Initialize minio client object.
	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: false,
	})
	//minioClient, err := minio.New(endpoint, accessKeyID, secretAccessKey, false)
	HandleError(err)
	return minioClient
}

type RssFeed struct {
	Id       int    `json:"id"`
	Title    string `json:"title"`
	Category string `json:"category"`
	FeedUrl  string `json:"feedUrl"`
	SiteUrl  string `json:"siteUrl"`
}

func (input *WorkflowInputMinifluxToS3) GetRssFeeds() ([]RssFeed, error) {
	rows, err := input.Db.Query("select f.id, f.title, c.title category,  f.feed_url, f.site_url\nfrom feeds f\n         inner join categories c on c.id = f.category_id\norder by f.id desc")
	HandleError(err)
	defer rows.Close()
	var res RssFeed
	var feeds []RssFeed
	for rows.Next() {
		err := rows.Scan(&res.Id, &res.Title, &res.Category, &res.FeedUrl, &res.SiteUrl)
		HandleError(err)
		feeds = append(feeds, res)
	}
	return feeds, nil
}

func (input *WorkflowInputMinifluxToS3) UploadFile(feeds []RssFeed) error {
	jsonBytes, err := json.Marshal(feeds)
	if err != nil {
		return err
	}

	r := bytes.NewReader(jsonBytes)

	_, err = input.StorageClient.PutObject(context.Background(), "etl", "miniflux_dump.json", r, r.Size(), minio.PutObjectOptions{
		ContentType: "application/json",
	})
	if err != nil {
		return err
	}

	return nil
}

func WorkflowMinifluxToS3(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Second * 30,
	}
	ctx = workflow.WithActivityOptions(ctx, options)

	db, err := GetMinifluxDb()
	if err != nil {
		return err
	}

	var activities = WorkflowInputMinifluxToS3{
		Db: db,
	}

	var feeds []RssFeed
	err = workflow.ExecuteActivity(ctx, activities.GetRssFeeds).Get(ctx, &feeds)
	if err != nil {
		return err
	}

	err = workflow.ExecuteActivity(ctx, activities.UploadFile, feeds).Get(ctx, nil)
	if err != nil {
		return err
	}

	return err

}
