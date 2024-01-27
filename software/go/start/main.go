package main

import (
	"context"
	"fmt"
	"shared"
	"shared/temporalstuff"

	"log"

	"go.temporal.io/sdk/client"
)

func main() {

	// Create the client object just once per process
	c, err := client.Dial(client.Options{
		HostPort: "server1.local:7233",
	})
	if err != nil {
		log.Fatalln("unable to create Temporal client", err)
	}
	defer c.Close()

	options := client.StartWorkflowOptions{
		ID:        "obsidian-theme-workflow",
		TaskQueue: shared.GreetingTaskQueue,
	}

	// Start the Workflow
	//name := "World"
	we, err := c.ExecuteWorkflow(context.Background(), options, temporalstuff.ObsidianThemeWorkflow)
	if err != nil {
		log.Fatalln("unable to complete Workflow", err)
	}

	// Get the results
	//var greeting string
	//err = we.Get(context.Background(), &greeting)
	//if err != nil {
	//	log.Fatalln("unable to get Workflow result", err)
	//}

	printResults("", we.GetID(), we.GetRunID())
}

func printResults(greeting string, workflowID, runID string) {
	fmt.Printf("\nWorkflowID: %s RunID: %s\n", workflowID, runID)
	fmt.Printf("\n%s\n\n", greeting)
}
