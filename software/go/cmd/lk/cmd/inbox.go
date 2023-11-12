/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"github.com/goccy/go-json"
	"github.com/spf13/viper"
	"os"

	"github.com/charmbracelet/log"
	"github.com/spf13/cobra"
	"net/http"
	"time"
)

const InboxApiKeyConfig = "raindrop_api_key"

// inboxCmd represents the inbox command
var inboxCmd = &cobra.Command{
	Use:   "inbox",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		var apiKey = viper.GetString(InboxApiKeyConfig)
		if apiKey == "" {
			panic("Config not found: " + InboxApiKeyConfig)
		}

		log.Info("Calling Raindrop.io...")

		client := &http.Client{}
		req, err := http.NewRequest(http.MethodGet, "https://api.raindrop.io/rest/v1/raindrops/36282268", nil)
		req.Header.Add("Authorization", "Bearer "+apiKey)
		resp, err := client.Do(req)

		decoder := json.NewDecoder(resp.Body)
		var t RaindropResponse
		err = decoder.Decode(&t)
		if err != nil {
			log.Error(err)
		}

		log.Infof("Found %s of %s inbox items", len(t.Items), t.Count)

		isJson, _ := cmd.Flags().GetBool("json")

		if isJson {
			idk := make([]RaindropCustomResponse, len(t.Items))
			for i := 0; i < len(t.Items); i++ {
				idk[i].ID = t.Items[i].ID
				idk[i].Title = t.Items[i].Title
				idk[i].Link = t.Items[i].Link
			}

			//jsonBytes, err := json.Marshal(idk)
			encoder := json.NewEncoder(os.Stdout)
			err := encoder.Encode(idk)
			if err != nil {
				panic(err)
			}
			return
		}

		// Output pretty
		for i := 0; i < len(t.Items); i++ {
			log.Infof("%s - %s", t.Items[i].Title, t.Items[i].Link)
		}

	},
}

func init() {
	rootCmd.AddCommand(inboxCmd)
}

type RaindropCustomResponse struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Link  string `json:"link"`
}

type RaindropResponse struct {
	Result bool `json:"result"`
	Items  []struct {
		ID      int    `json:"_id"`
		Link    string `json:"link"`
		Title   string `json:"title"`
		Excerpt string `json:"excerpt"`
		Note    string `json:"note"`
		Type    string `json:"type"`
		User    struct {
			Ref string `json:"$ref"`
			ID  int    `json:"$id"`
		} `json:"user"`
		Cover string `json:"cover"`
		Media []struct {
			Link string `json:"link"`
			Type string `json:"type"`
		} `json:"media"`
		Tags      []any `json:"tags"`
		Important bool  `json:"important,omitempty"`
		Reminder  struct {
			Date any `json:"date"`
		} `json:"reminder,omitempty"`
		Removed    bool      `json:"removed"`
		Created    time.Time `json:"created"`
		LastUpdate time.Time `json:"lastUpdate"`
		Collection struct {
			Ref string `json:"$ref"`
			ID  int    `json:"$id"`
			Oid int    `json:"oid"`
		} `json:"collection"`
		Highlights []any  `json:"highlights"`
		Domain     string `json:"domain"`
		CreatorRef struct {
			ID     int    `json:"_id"`
			Avatar string `json:"avatar"`
			Name   string `json:"name"`
			Email  string `json:"email"`
		} `json:"creatorRef"`
		Sort         int `json:"sort"`
		CollectionID int `json:"collectionId"`
		File         struct {
			Name string `json:"name"`
			Size int    `json:"size"`
			Type string `json:"type"`
		} `json:"file,omitempty"`
	} `json:"items"`
	Count        int `json:"count"`
	CollectionID int `json:"collectionId"`
}
