package temporalstuff

import (
	"context"
	"database/sql"
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/table"
	"github.com/charmbracelet/log"
	"github.com/goccy/go-json"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/workflow"
	"io/fs"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"shared"
	"shared/fitness"
	"sort"
	"strconv"
	"strings"
	"time"
)

func SendFitnessEmailActivity(ctx context.Context) (string, error) {
	log.Info("do the real stuff man")
	GetFitnessIdk()
	directoryPath2 := shared.GetPath("/home/lane/Documents/lkat-vault", "C:\\Users\\looni\\vault1")
	idk := fitness.GetFitnessActivities(directoryPath2)

	fitness.PersistFitnessActivities(idk)

	KickBuild()

	log.Info("Done!")
	return "i guess i ran well", nil
}

type AppConfig struct {
	Theme               string `json:"theme"`
	BaseFontSize        int    `json:"baseFontSize"`
	CssTheme            string `json:"cssTheme"`
	Translucency        bool   `json:"translucency"`
	AccentColor         string `json:"accentColor"`
	InterfaceFontFamily string `json:"interfaceFontFamily"`
	TextFontFamily      string `json:"textFontFamily"`
}

func LoadAndPersistObsidianThemeFile(ctx context.Context) error {
	jsonData, err := os.ReadFile("/home/lane/Documents/lkat-vault/.obsidian/appearance.json")
	shared.HandleError(err)

	var data AppConfig

	err = json.Unmarshal(jsonData, &data)
	if err != nil {
		return err
	}
	//shared.HandleError(err)

	// persist to sql?
	var connStr = viper.GetString(shared.PostgresApiKeyConfig)
	if connStr == "" {
		panic("Config not found: " + shared.PostgresApiKeyConfig)
	}

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return err
	}

	_, err = db.Exec("insert into metric (value, metric_type, datatype) VALUES ($1, $2, $3)", data.CssTheme, "obsidian_theme", "string")
	if err != nil {
		return err
	}

	log.Info("I should have worked")

	return nil
}

func KickBuild() {
	var connStr = viper.GetString("loonisoncom_build_hook")
	if connStr == "" {
		panic("Config not found: " + "loonisoncom_build_hook")
	}

	log.Info("Kicking netlify...")
	_, err := http.Post("https://api.netlify.com/build_hooks/656bea07c564b13021346209", "application/json", strings.NewReader("{}"))
	shared.HandleError(err)
}

func GetFitnessIdk() {
	startTime := time.Now()

	var connStr = viper.GetString(shared.ResendApiKeyConfig)
	if connStr == "" {
		panic("Config not found: " + shared.ResendApiKeyConfig)
	}

	directoryPath := shared.GetPath("/home/lane/Documents/lkat-vault", "C:\\Users\\looni\\vault1")
	files, err := ioutil.ReadDir(directoryPath)
	if err != nil {
		shared.HandleError(err)
	}

	fileNameRegex := regexp.MustCompile(`^\d{4}-\d{2}-\d{2}\.md$`)

	fitnessStats := make(map[string]FitnessResult)

	for _, file := range files {
		// Check if it's a regular file (not a directory)
		if file.Mode().IsRegular() {
			// Check if the file has a .md extension
			if fileNameRegex.MatchString(file.Name()) {
				// Read the file content
				filePath := filepath.Join(directoryPath, file.Name())
				result := ProcessFile(filePath, file.Name())
				//results = append(results, result)
				isoWeek, exists := fitnessStats[result.Week]
				if exists {
					isoWeek.CompletedActivityCount += result.CompletedActivityCount
					fitnessStats[result.Week] = isoWeek
				} else {
					fitnessStats[result.Week] = result
				}
			}
		}
	}

	directoryPath2 := shared.GetPath("/home/lane/Documents/lkat-vault/Journal", "C:\\Users\\looni\\vault1\\Journal")
	err = filepath.Walk(directoryPath2, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			shared.HandleError(err)
		}
		if info.Mode().IsRegular() && fileNameRegex.MatchString(info.Name()) {
			//filePath := filepath.Join(directoryPath, file.Name())
			result := ProcessFile(path, info.Name())
			existingGroup, exists := fitnessStats[result.Week]
			if exists {
				existingGroup.CompletedActivityCount = existingGroup.CompletedActivityCount + result.CompletedActivityCount
				//existingGroup
				fitnessStats[result.Week] = existingGroup
			} else {
				fitnessStats[result.Week] = result
			}
		}

		return nil
	})
	if err != nil {
		shared.HandleError(err)
	}

	adventures, err := ioutil.ReadDir(shared.GetPath("/home/lane/Documents/lkat-vault/Adventures", "C:\\Users\\looni\\vault1\\Adventures"))
	shared.HandleError(err)

	validAdventures := []string{"disc golf", "basketball", "indoor climbing", "volleyball", "indoor bouldering"}
	adventureDateFormat := "2006-01-02"
	for _, file := range adventures {
		if file.Mode().IsRegular() {
			// check if file name contains

			date, err := time.Parse(adventureDateFormat, file.Name()[:10])
			shared.HandleError(err)
			activityToCheck := strings.ToLower(strings.TrimSpace(file.Name()[10:]))

			for _, templateAdventureName := range validAdventures {
				if strings.Contains(activityToCheck, templateAdventureName) {
					// ok we like this append
					sunday := shared.FindSunday(date)
					existingGroup, exists := fitnessStats[sunday.Format("2006-01-02")]
					if exists {
						existingGroup.CompletedActivityCount += 1
						fitnessStats[sunday.Format("2006-01-02")] = existingGroup
					} else {
						fitnessStats[sunday.Format("2006-01-02")] = FitnessResult{
							Week:                   sunday.Format("2006-01-02"),
							CompletedActivityCount: 1,
						}
					}
				}
			}

		}
	}

	// Convert to array to sort and display, but filter only wanted values
	var fitnessArray []FitnessResult
	for _, value := range fitnessStats {
		if value.CompletedActivityCount > 0 {
			fitnessArray = append(fitnessArray, value)
		}

	}

	sort.Slice(fitnessArray, func(i, j int) bool {
		return fitnessArray[i].Week < fitnessArray[j].Week
	})

	endTime := time.Now()

	t := table.New().Border(lipgloss.NormalBorder()).BorderStyle(lipgloss.NewStyle().Foreground(lipgloss.Color("99"))).
		Headers("Week", "Completed Activities")

	htmlLines := []string{"<ul>"}
	for _, value := range fitnessArray {
		t.Row(value.Week, strconv.Itoa(value.CompletedActivityCount))
		htmlLines = append(htmlLines, "<li>", value.Week, " - ", strconv.Itoa(value.CompletedActivityCount), "</li>")
	}
	htmlLines = append(htmlLines, "</ul>")
	htmlLines = append(htmlLines, "<b>Today</b>: ", time.Now().Format("2006-01-02"))

	fmt.Println(t)

	//client := resend.NewClient(connStr)
	//
	//params := &resend.SendEmailRequest{
	//	From:    "onboarding@resend.dev",
	//	To:      []string{"lanekatris@gmail.com"},
	//	Subject: "Be active reminder",
	//	Html:    strings.Join(htmlLines, ""),
	//}
	//send, err := client.Emails.Send(params)
	//shared.HandleError(err)

	//log.Infof("Sent email", "id", send.Id)
	log.Info("Removed send email support for now")

	duration := endTime.Sub(startTime)

	fmt.Println("Time Taken: %v\n", duration)
}
func ProcessFile(filePath string, fileName string) FitnessResult {
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
	}

	content, err := ioutil.ReadFile(filePath)

	if err != nil {
		//fmt.Printf("Error reading file %s: %v\n", file.Name(), err)
		//continue
		shared.HandleError(err)
	}

	markdownContent := string(content)

	completedActivities := 0
	incompleteActivities := 0

	for i := 0; i < len(activities); i++ {
		if strings.Contains(markdownContent, strings.TrimSpace(activities[i])) {
			completedActivities++
		} else {
			incompleteActivities++
		}
	}

	date, err := time.Parse("2006-01-02", strings.ReplaceAll(fileName, ".md", ""))
	if err != nil {
		shared.HandleError(err)
	}

	sunday := shared.FindSunday(date)

	hmm := FitnessResult{
		Week:                   sunday.Format("2006-01-02"),
		CompletedActivityCount: completedActivities,
	}
	return hmm
}

type FitnessResult struct {
	Week                   string
	CompletedActivityCount int
}

func SendFitnessEmailWorkflow(ctx workflow.Context, name string) (string, error) {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 5,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var result string
	err := workflow.ExecuteActivity(ctx, SendFitnessEmailActivity).Get(ctx, &result)

	return result, err
}

func ObsidianThemeWorkflow(ctx workflow.Context) (string, error) {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 5,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var result string
	err := workflow.ExecuteActivity(ctx, LoadAndPersistObsidianThemeFile).Get(ctx, &result)

	return result, err
}
