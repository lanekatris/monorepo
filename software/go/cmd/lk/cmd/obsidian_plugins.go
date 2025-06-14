/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/atsushinee/go-markdown-generator/doc"
	"github.com/spf13/cobra"
	"os"
	"sort"
)

// pluginsCmd represents the plugins command
var pluginsCmd = &cobra.Command{
	Use:   "plugins",
	Short: "A brief description of your command",
	Run: func(cmd *cobra.Command, args []string) {
		var data = GetCommunityPlugins()
		var quickAddChoices = GetQuickAddConfiguration()

		//fmt.Println("Community Plugins:")
		//for i := 0; i < len(data); i++ {
		//	fmt.Println(data[i])
		//}

		//fmt.Println()
		//fmt.Println()
		//fmt.Println("Quick Add Choices:")
		//for i := 0; i < len(quickAddChoices); i++ {
		//	fmt.Println(quickAddChoices[i])
		//}

		// TODO: Toggle markdown or stdout based on format flag?
		idk := doc.NewMarkDown()

		idk.Write("**Generated On**: " + time.Now().Format("2006-01-02 15:04:05"))
		idk.WriteLines(2)

		idk.WriteLevel1Title("Community Plugins")
		idk.Writeln()
		for i := 0; i < len(data); i++ {
			idk.Write("- " + data[i])
			idk.Writeln()
		}

		idk.WriteLines(2)
		idk.WriteLevel1Title("Quick Add Choices")
		idk.Writeln()
		for i := 0; i < len(quickAddChoices); i++ {
			idk.Write("- " + quickAddChoices[i])
			idk.Writeln()
		}

		idk.Export("C:\\Users\\looni\\OneDrive\\Documents\\vault1\\Public\\My Obsidian Plugins (Generated).md")

		fmt.Println(idk.String())
	},
}

func GetCommunityPlugins() []string {
	file, err := os.Open("C:\\Users\\looni\\OneDrive\\Documents\\vault1\\.obsidian\\community-plugins.json")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return nil
	}
	defer file.Close()

	decoder := json.NewDecoder(file)

	var data []string

	err = decoder.Decode(&data)
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		return nil
	}

	sort.Strings(data)
	return data
}

type QuickAddChoice struct {
	Name string `json:"name"`
}

type QuickAddConfiguration struct {
	Choices []QuickAddChoice `json:"choices"`
}

func GetQuickAddConfiguration() []string {
	file, err := os.Open("C:\\Users\\looni\\OneDrive\\Documents\\vault1\\.obsidian\\plugins\\quickadd\\data.json")
	if err != nil {
		fmt.Println("Error opening file:", err)
		return nil
	}
	defer file.Close()

	decoder := json.NewDecoder(file)

	var data QuickAddConfiguration

	err = decoder.Decode(&data)
	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		return nil
	}

	//var final []string
	var final = make([]string, len(data.Choices))

	for i := 0; i < len(data.Choices); i++ {
		//final = append(final, data.Choices[0].Name)
		final[i] = data.Choices[i].Name
	}

	sort.Strings(final)
	return final

}

func init() {
	obsidianCmd.AddCommand(pluginsCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// pluginsCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// pluginsCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
