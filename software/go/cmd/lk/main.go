/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package main

import (
	"github.com/charmbracelet/log"
	"github.com/spf13/viper"
	"lkat/cmd/lk/cmd"
)

func main() {
	setupViper()
	cmd.Execute()
}

func setupViper() {
	viper.SetConfigName(".lk")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("$HOME")
	//err := viper.ReadInConfig()
	//if err != nil {
	//	panic(err)
	//}
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			// create it
			log.Info("No config file found, creating...")
			viper.Set(cmd.InboxApiKeyConfig, "")
			viper.Set(cmd.PostgresApiKeyConfig, "")
			err = viper.SafeWriteConfig()
			if err != nil {
				panic(err)
			}
			log.Info("Config file created!")
		} else {
			panic(err)
		}

	}
}
