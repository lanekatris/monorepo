package lkat

import (
	"context"
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/table"
	"github.com/charmbracelet/log"
	"github.com/resendlabs/resend-go"
	"github.com/spf13/viper"
	"go.temporal.io/sdk/workflow"
	"io/fs"
	"io/ioutil"
	"path/filepath"
	"regexp"
	"runtime"
	"sort"
	"strconv"
	"strings"
	"time"
)

func SendFitnessEmailActivity(ctx context.Context) (string, error) {
	log.Info("do the real stuff man")
	GetFitnessIdk()
	return "i guess i ran well", nil
}

const GreetingTaskQueue = "GREETING_TASK_QUEUE"

func SendFitnessEmailWorkflow(ctx workflow.Context, name string) (string, error) {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Second * 5,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var result string
	err := workflow.ExecuteActivity(ctx, SendFitnessEmailActivity).Get(ctx, &result)

	return result, err
}

var ResendApiKeyConfig = "resend_api_key"

func GetFitnessIdk() {
	startTime := time.Now()

	var connStr = viper.GetString(ResendApiKeyConfig)
	if connStr == "" {
		panic("Config not found: " + ResendApiKeyConfig)
	}

	directoryPath := getPath("/home/lane/Documents/lkat-vault", "C:\\Users\\looni\\vault1")
	files, err := ioutil.ReadDir(directoryPath)
	if err != nil {
		HandleError(err)
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

	directoryPath2 := getPath("/home/lane/Documents/lkat-vault/Journal", "C:\\Users\\looni\\vault1\\Journal")
	err = filepath.Walk(directoryPath2, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			HandleError(err)
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
		HandleError(err)
	}

	adventures, err := ioutil.ReadDir(getPath("/home/lane/Documents/lkat-vault/Adventures", "C:\\Users\\looni\\vault1\\Adventures"))
	HandleError(err)

	validAdventures := []string{"disc golf", "basketball", "indoor climbing", "volleyball", "indoor bouldering"}
	adventureDateFormat := "2006-01-02"
	for _, file := range adventures {
		if file.Mode().IsRegular() {
			// check if file name contains

			date, err := time.Parse(adventureDateFormat, file.Name()[:10])
			HandleError(err)
			activityToCheck := strings.ToLower(strings.TrimSpace(file.Name()[10:]))

			for _, templateAdventureName := range validAdventures {
				if strings.Contains(activityToCheck, templateAdventureName) {
					// ok we like this append
					sunday := FindSunday(date)
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

	client := resend.NewClient(connStr)

	params := &resend.SendEmailRequest{
		From:    "onboarding@resend.dev",
		To:      []string{"lanekatris@gmail.com"},
		Subject: "Be active reminder",
		Html:    strings.Join(htmlLines, ""),
	}
	send, err := client.Emails.Send(params)
	HandleError(err)

	log.Infof("Sent email", "id", send.Id)

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
		HandleError(err)
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
		HandleError(err)
	}

	sunday := FindSunday(date)

	// Nice for debugging
	//if sunday.Format("2006-01-02") == "2023-12-10" {
	//	log.Info(filePath, "completed", completedActivities, "incomplete", incompleteActivities)
	//}

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

func HandleError(err error) {
	if err != nil {
		panic(err)
	}
}

func isLinux() bool {
	return runtime.GOOS == "linux"
}

func getPath(linuxPath string, windowsPath string) string {
	if isLinux() {
		return linuxPath
	}
	return windowsPath
}

func SetupViper() {
	viper.SetConfigName(".lk")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("$HOME")
	viper.AutomaticEnv()
	//err := viper.ReadInConfig()
	//if err != nil {
	//	panic(err)
	//}
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// create it
			log.Info("No config file found")
			//viper.Set(cmd.InboxApiKeyConfig, "")
			//viper.Set(cmd.PostgresApiKeyConfig, "")
			//err = viper.SafeWriteConfig()
			//if err != nil {
			//	panic(err)
			//}
			//log.Info("Config file created!")
		} else {
			panic(err)
		}

	}
}
