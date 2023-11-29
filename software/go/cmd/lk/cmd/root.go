/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/table"
	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

//func countChecked(content string) int {
//	// Create a regular expression pattern to match checked checkboxes ([x])
//	re := regexp.MustCompile(`\[x\]`)
//
//	// Find all matches in the content
//	matches := re.FindAllString(content, -1)
//
//	// Return the count of matches
//	return len(matches)
//}

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "lk",
	Short: "A brief description of your application",
	Long: `A longer description that spans multiple lines and likely contains
examples and usage of using your application. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	Run: func(cmd *cobra.Command, args []string) {
		log.Info("ahh")
		//err := beeep.Notify("Title", "Message body", "C:\\Users\\looni\\OneDrive\\Pictures\\Camera Roll\\393146857_2402553829927542_4045854401555263033_n.jpg")
		//if err != nil {
		//	panic(err)
		//}

		directoryPath := "C:\\Users\\looni\\vault1"
		files, err := ioutil.ReadDir(directoryPath)
		if err != nil {
			handleError(err)
		}

		fileNameRegex := regexp.MustCompile(`^\d{4}-\d{2}-\d{2}\.md$`)

		//var results []FitnessResult

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

		err = filepath.Walk("C:\\Users\\looni\\vault1\\Journal", func(path string, info fs.FileInfo, err error) error {
			if err != nil {
				handleError(err)
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
			handleError(err)
		}

		//markdownContent := `
		//- [ ] Stand at least for 29 minutes a day (to stretch back) (even at desk)
		//- [ ] Do 50 crunches or 25 leg ups while hanging
		//- [x] Do 25 push ups
		//- [ ] 5 Chin Ups
		//- [x] Stretch
		//- [ ] Hang for 2 minutes
		//- [x] Plank for 2 minutes
		//- [ ] active pigeon folds
		//- [ ] updog press
		//`

		// Either load files or load from sql...
		//fileContents, err := ioutil.ReadFile("C:\\Users\\looni\\vault1\\2023-12-11.md")
		//handleError(err)
		//markdownContent := string(fileContents)
		//
		//completedActivities := 0
		//incompleteActivities := 0
		//
		//for i := 0; i < len(activities); i++ {
		//	if strings.Contains(markdownContent, strings.TrimSpace(activities[i])) {
		//		completedActivities++
		//	} else {
		//		incompleteActivities++
		//	}
		//}

		//log.Info("Fitness", "completed", completedActivities, "incomplete", incompleteActivities)
		//
		//		checkedCount := countChecked(markdownContent)

		// Now we know the total completed for a iso week
		//log.Info(fitnessStats)

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

		t := table.New().Border(lipgloss.NormalBorder()).BorderStyle(lipgloss.NewStyle().Foreground(lipgloss.Color("99"))).
			Headers("Week", "Completed Activities")

		//for _, value := range fitnessStats {
		//	t.Row(value.Week, strconv.Itoa(value.CompletedActivityCount))
		//}

		for _, value := range fitnessArray {
			t.Row(value.Week, strconv.Itoa(value.CompletedActivityCount))
		}

		fmt.Println(t)

	},
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
		handleError(err)
	}

	// Print the file content
	//fmt.Printf("Markdown File: %s\nContent:\n%s\n", file.Name(), content)
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

	//if completedActivities > 0 {
	//log.Info(filePath, "completed", completedActivities, "incomplete", incompleteActivities)
	date, err := time.Parse("2006-01-02", strings.ReplaceAll(fileName, ".md", ""))
	if err != nil {
		handleError(err)
	}

	//year, week := date.ISOWeek()

	//year, week := isoweek.FromDate(date.Year(), date.Month(), date.Day())
	//loc, err := time.LoadLocation("EST")
	//handleError(err)
	//st := isoweek.StartTime(year, week, loc)

	//year, week := date.ISOWeek()

	sunday := FindSunday(date)

	// Nice for debugging
	//if sunday.Format("2006-01-02") == "2023-12-10" {
	//	log.Info(filePath, "completed", completedActivities, "incomplete", incompleteActivities)
	//}

	//log.Info(sunday.Format("2006-01-02"))

	//log.Info(strconv.Itoa(year) + " - " + strconv.Itoa(week) + " - " + strconv.Itoa(completedActivities) + " - " + filePath)

	//log.Info("start of week", st)
	//log.Info("year", year, "week", week)
	//log.Info(FirstDayOfISOWeek(year, week, time.Local))

	// now that we know the year-week, lets find sum up everything for the week

	//}

	//weekNumber := prependZeros(strconv.Itoa(week), 2)

	hmm := FitnessResult{
		//Week:                   strconv.Itoa(year) + "-W" + weekNumber,
		Week:                   sunday.Format("2006-01-02"),
		CompletedActivityCount: completedActivities,
	}
	return hmm

}

type FitnessResult struct {
	Week                   string
	CompletedActivityCount int
}

func prependZeros(original string, totalLength int) string {
	if len(original) >= totalLength {
		return original
	}

	zeroCount := totalLength - len(original)
	zeroString := strings.Repeat("0", zeroCount)
	return zeroString + original
}

func startOfWeek(date time.Time) time.Time {
	// Calculate the difference in days between the given date and Sunday
	daysSinceSunday := int(date.Weekday() - time.Sunday)
	if daysSinceSunday < 0 {
		daysSinceSunday += 7
	}

	// Calculate the start of the week by subtracting the difference in days
	startOfWeek := date.AddDate(0, 0, -daysSinceSunday)

	return startOfWeek
}

func FirstDayOfISOWeek(year int, week int, timezone *time.Location) time.Time {
	date := time.Date(year, 0, 0, 0, 0, 0, 0, timezone)
	isoYear, isoWeek := date.ISOWeek()

	// iterate back to Monday
	for date.Weekday() != time.Monday {
		date = date.AddDate(0, 0, -1)
		isoYear, isoWeek = date.ISOWeek()
	}

	// iterate forward to the first day of the first week
	for isoYear < year {
		date = date.AddDate(0, 0, 7)
		isoYear, isoWeek = date.ISOWeek()
	}

	// iterate forward to the first day of the given week
	for isoWeek < week {
		date = date.AddDate(0, 0, 7)
		isoYear, isoWeek = date.ISOWeek()
	}

	return date
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.

	// rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.lk.yaml)")
	// // inboxCmd.PersistentFlags().String("foo", "", "A help for foo")
	rootCmd.PersistentFlags().BoolP("json", "j", false, "Ouptut as JSON")

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
