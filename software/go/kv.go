package shared

import (
	"bytes"
	"context"
	"fmt"
	"github.com/minio/minio-go/v7"
	"io"
)

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
