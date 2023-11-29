/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"database/sql"
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/lipgloss/table"
	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"strconv"
	"time"
)

// meCmd represents the me command
var meCmd = &cobra.Command{
	Use:   "me",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {

		//err := syncCmd.Execute()
		// TODO: Probably want a dedicated function to call instead of magic strings
		//rootCmd.SetArgs([]string{"obsidian", "sync"})
		//err := rootCmd.Execute()
		//if err != nil {
		//	panic(err)
		//}

		var connStr = viper.GetString(PostgresApiKeyConfig)
		if connStr == "" {
			panic("Config not found: " + PostgresApiKeyConfig)
		}

		log.Info("Getting your health stats...")
		db, err := sql.Open("postgres", connStr)
		if err != nil {
			panic(err)
		}
		rows, err := db.Query("select exists(select 1 from kestra.obsidian_feed where date::date = $1 and activity = 'General Stretching')", time.Now())

		var res bool
		for rows.Next() {
			err := rows.Scan(&res)
			if err != nil {
				panic(err)
			}
		}

		if res == false {
			log.Error("Hey you haven't stretched today, want to be in pain?")
		} else {
			log.Info("You're stretching as expected ✅")
		}

		var newPlace = hasGoneSomewhereNew(db)
		if newPlace == true {
			log.Info("You've gone somewhere new recently ✅")
		} else {
			log.Error("You need to visit somewhere new")
		}

		rows, err = db.Query(`
with x as (select a.date, a.activity, fp."Points", date_bin('7 days', a.date::date, timestamp '2023-1-1')
           from kestra.obsidian_feed a
                    inner join noco.fitness_points fp on a.activity = fp."Activity")
select x.date_bin::date start,(x.date_bin::date + INTERVAL '6 day')::date "end", sum(x."Points") points
from x
group by x.date_bin
order by x.date_bin
`)

		var week PointsWeek
		var weeks []PointsWeek
		for rows.Next() {
			err := rows.Scan(&week.Start, &week.End, &week.Points)
			if err != nil {
				panic(err)
			}
			weeks = append(weeks, week)
		}

		t := table.New().Border(lipgloss.NormalBorder()).BorderStyle(lipgloss.NewStyle().Foreground(lipgloss.Color("99"))).
			Headers("Start", "End", "Points")

		for i := 0; i < len(weeks); i++ {
			t.Row(weeks[i].Start.Format("2006-01-02"), weeks[i].End.Format("2006-01-02"), strconv.Itoa(weeks[i].Points))

		}
		fmt.Println(t)
	},
}

func hasGoneSomewhereNew(db *sql.DB) bool {
	rows, err := db.Query(`select exists(select 1 from noco.place where visited_date > current_date - 7)`)
	handleError(err)

	var res bool
	for rows.Next() {
		err := rows.Scan(&res)
		handleError(err)
	}

	return res
}

func handleError(err error) {
	if err != nil {
		panic(err)
	}
}

func init() {
	rootCmd.AddCommand(meCmd)
}

type PointsWeek struct {
	Start  time.Time
	End    time.Time
	Points int
}
