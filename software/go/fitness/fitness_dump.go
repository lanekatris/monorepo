package fitness

import (
	"database/sql"
	"github.com/charmbracelet/log"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
	"io/fs"
	"io/ioutil"
	"path/filepath"
	"regexp"
	"shared"
	"strings"
	"time"
)

type MarkdownFitnessRecording struct {
	Path      string
	Date      string
	WeekStart string
	Activity  string
}

func GetFitnessActivities(rootPath string) []MarkdownFitnessRecording {
	journalActivities, err := getJournalActivities(filepath.Join(rootPath, "Journal"))
	shared.HandleError(err)

	rootJournalActivities, err := getJournalActivities(rootPath)
	shared.HandleError(err)

	adventureActivities, err := getAdventureActivities(filepath.Join(rootPath, "Adventures"))
	shared.HandleError(err)

	return shared.ConcatMultipleSlices([][]MarkdownFitnessRecording{journalActivities, rootJournalActivities, adventureActivities})
}

func PersistFitnessActivities(activities []MarkdownFitnessRecording) {
	var connStr = viper.GetString(shared.PostgresApiKeyConfig)
	if connStr == "" {
		panic("Config not found: " + shared.PostgresApiKeyConfig)
	}

	db, err := sql.Open("postgres", connStr)
	shared.HandleError(err)

	log.Info("Deleting...")
	_, err = db.Exec("delete from noco.\"Test_Obsidian_Fitness\"")
	shared.HandleError(err)

	// TODO: Use bulk insert not individual
	for _, activity := range activities {
		log.Info("Inserting " + activity.Path)
		query := "INSERT INTO noco.\"Test_Obsidian_Fitness\" (file_relative_path, date, week_start, activity) VALUES ($1, $2, $3, $4)"
		_, err := db.Exec(query, activity.Path, activity.Date, activity.WeekStart, activity.Activity)
		shared.HandleError(err)
	}
}

func getJournalActivities(path string) ([]MarkdownFitnessRecording, error) {
	var results []MarkdownFitnessRecording

	fileNameRegex := regexp.MustCompile(`^\d{4}-\d{2}-\d{2}\.md$`)
	adventureDateFormat := "2006-01-02"
	activities := []string{
		"- [x] Stand at least for 29 minutes a day (to stretch back) (even at desk)",
		"- [x] Do 50 crunches or 25 leg ups while hanging",
		"- [x] Do 25 push ups",
		"- [x] 5 Chin Ups",
		"- [x] Stretch",
		"- [x] Hang for 2 minutes",
		"- [x] Plank for 2 minutes",
		"- [x] active pigeon folds",
		"- [x] updog press",
		"- [x] Ice back",
		"- [x] Leg Raises",
	}
	err := filepath.Walk(path, func(path2 string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.Mode().IsRegular() && fileNameRegex.MatchString(info.Name()) {
			content, err := ioutil.ReadFile(path2)
			if err != nil {
				return err
			}
			markdownContent := string(content)

			idk, err := time.Parse(adventureDateFormat, info.Name()[:10])
			if err != nil {
				return err
			}
			for i := 0; i < len(activities); i++ {
				if strings.Contains(markdownContent, strings.TrimSpace(activities[i])) {
					results = append(results, MarkdownFitnessRecording{
						Path:      strings.Replace(path2, path, "", 1),
						Date:      info.Name()[:10],
						WeekStart: shared.FindSunday(idk).Format(adventureDateFormat),
						Activity:  activities[i],
					})
				}
			}
		}

		return nil
	})
	return results, err
}

func getAdventureActivities(path string) ([]MarkdownFitnessRecording, error) {
	validAdventures := []string{"disc golf", "basketball", "indoor climbing", "volleyball", "indoor bouldering"}
	adventureDateFormat := "2006-01-02"

	adventures, err := ioutil.ReadDir(path)
	shared.HandleError(err)

	var results []MarkdownFitnessRecording
	for _, file := range adventures {
		if file.Mode().IsRegular() {
			// check if file name contains

			date, err := time.Parse(adventureDateFormat, file.Name()[:10])
			if err != nil {
				return nil, err
			}

			activityToCheck := strings.ToLower(strings.TrimSpace(file.Name()[10:]))

			for _, templateAdventureName := range validAdventures {
				if strings.Contains(activityToCheck, templateAdventureName) {
					// ok we like this append
					sunday := shared.FindSunday(date)
					//components := strings.Split(path + file.Name(), "/")
					results = append(results, MarkdownFitnessRecording{
						Path:      "Adventures/" + file.Name(),
						Date:      file.Name()[:10],
						WeekStart: sunday.Format(adventureDateFormat),
						Activity:  templateAdventureName,
					})
				}
			}

		}
	}

	return results, nil
}
