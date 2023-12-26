/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package main

import (
	"lkat"
	"lkat/cmd/lk/cmd"
)

func main() {
	lkat.SetupViper()
	cmd.Execute()
}
