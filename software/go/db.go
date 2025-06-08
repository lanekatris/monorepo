package shared

import (
	"context"
	"database/sql"
	"errors"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"os"
	"time"
)

func GetPgxDb() (*pgxpool.Pool, error) {
	SetupViper()
	var connStr = viper.GetString(PostgresApiKeyConfig)
	if connStr == "" {
		return nil, errors.New("config not found: " + PostgresApiKeyConfig)
	}

	ctx := context.Background()

	// Use pool as it reconnects automatically
	cfg, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		return nil, err
	}

	return pgxpool.NewWithConfig(ctx, cfg)
}

func GetDb() (*sql.DB, error) {
	SetupViper()
	var connStr = viper.GetString(PostgresApiKeyConfig)
	if connStr == "" {
		return nil, errors.New("config not found: " + PostgresApiKeyConfig)
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	return db, nil
}

func GetGormDb() (*gorm.DB, error) {
	SetupViper()
	var connStr = viper.GetString(PostgresApiKeyConfig)
	if connStr == "" {
		return nil, errors.New("config not found: " + PostgresApiKeyConfig)
	}

	// Cold start of serverless DB can take a bit, lets increase our slow threshold
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags), // io writer
		logger.Config{
			SlowThreshold:             time.Second * 5, // Slow SQL threshold
			LogLevel:                  logger.Silent,   // Log level
			IgnoreRecordNotFoundError: true,            // Ignore ErrRecordNotFound error for logger
			ParameterizedQueries:      true,            // Don't include params in the SQL log
			Colorful:                  true,            // Disable color
		},
	)

	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&ObsidianAdventuretwo{}, &MarkdownFileModel{}, &Event{})
	if err != nil {
		return nil, err
	}

	return db, nil
}
