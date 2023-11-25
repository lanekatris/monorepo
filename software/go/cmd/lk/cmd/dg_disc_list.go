/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/log"
	_ "github.com/lib/pq"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"os"
	"strconv"

	"github.com/charmbracelet/lipgloss/table"
)

// listCmd represents the list command
var listCmd = &cobra.Command{
	Use:   "list",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		var connStr = viper.GetString(PostgresApiKeyConfig)
		if connStr == "" {
			panic("Config not found: " + PostgresApiKeyConfig)
		}

		log.Info("Getting discs from Postgres...")

		db, err := sql.Open("postgres", connStr)
		if err != nil {
			panic(err)
		}

		rows, err := db.Query("select number, color Color, Brand, Plastic, Model, Status  from noco.disc order by number desc")
		defer rows.Close()
		if err != nil {
			panic(err)
		}

		var res Disc
		var todos []Disc
		for rows.Next() {
			err := rows.Scan(&res.Number, &res.Color, &res.Brand, &res.Plastic, &res.Model, &res.Status)
			if err != nil {
				panic(err)
			}
			todos = append(todos, res)
		}

		isJson, _ := cmd.Flags().GetBool("json")

		if isJson {
			encoder := json.NewEncoder(os.Stdout)
			err := encoder.Encode(todos)
			if err != nil {
				panic(err)
			}
			return
		}

		t := table.New().Border(lipgloss.NormalBorder()).BorderStyle(lipgloss.NewStyle().Foreground(lipgloss.Color("99"))).
			Headers("#", "Color", "Brand", "Plastic", "Model", "Status")

		for i := 0; i < len(todos); i++ {
			t.Row(strconv.Itoa(todos[i].Number), todos[i].Color, todos[i].Brand, todos[i].Plastic.String, todos[i].Model.String, todos[i].Status)
		}

		fmt.Println(t)

	},
}

func init() {
	dgCmd.AddCommand(listCmd)
}

type Disc struct {
	Number  int
	Color   string
	Brand   string
	Plastic sql.NullString
	Model   sql.NullString
	Status  string
}
