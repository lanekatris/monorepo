/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package main

import (
	"shared"
	"shared/cmd/lk/cmd"
)

func main() {
	shared.SetupViper()
	cmd.Execute()
}
