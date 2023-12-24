/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/table"
	"github.com/spf13/cobra"
	"io/fs"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"runtime"
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

func isLinux() bool {
	return runtime.GOOS == "linux"
}

func getPath(linuxPath string, windowsPath string) string {
	if isLinux() {
		return linuxPath
	}
	return windowsPath
}

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
		startTime := time.Now()
		//log.Info("ahh")
		//err := beeep.Notify("Title", "Message body", "C:\\Users\\looni\\OneDrive\\Pictures\\Camera Roll\\393146857_2402553829927542_4045854401555263033_n.jpg")
		//if err != nil {
		//	panic(err)
		//}

		directoryPath := getPath("/home/lane/Documents/lkat-vault", "C:\\Users\\looni\\vault1")
		files, err := ioutil.ReadDir(directoryPath)
		if err != nil {
			handleError(err)
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

		adventures, err := ioutil.ReadDir(getPath("/home/lane/Documents/lkat-vault/Adventures", "C:\\Users\\looni\\vault1\\Adventures"))
		handleError(err)

		validAdventures := []string{"disc golf", "basketball", "indoor climbing", "volleyball", "indoor bouldering"}
		adventureDateFormat := "2006-01-02"
		for _, file := range adventures {
			if file.Mode().IsRegular() {
				// check if file name contains

				date, err := time.Parse(adventureDateFormat, file.Name()[:10])
				handleError(err)
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

		//for _, value := range fitnessStats {
		//	t.Row(value.Week, strconv.Itoa(value.CompletedActivityCount))
		//}

		for _, value := range fitnessArray {
			t.Row(value.Week, strconv.Itoa(value.CompletedActivityCount))
		}

		fmt.Println(t)

		duration := endTime.Sub(startTime)

		fmt.Println("Time Taken: %v\n", duration)

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
		handleError(err)
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

func prependZeros(original string, totalLength int) string {
	if len(original) >= totalLength {
		return original
	}

	zeroCount := totalLength - len(original)
	zeroString := strings.Repeat("0", zeroCount)
	return zeroString + original
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
