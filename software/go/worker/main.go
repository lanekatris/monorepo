package main

import (
	"github.com/charmbracelet/log"
	"go.temporal.io/sdk/client"
	"go.temporal.io/sdk/worker"
	"shared"
	"shared/temporalstuff"
)

func main() {
	// Create the client object just once per process
	c, err := client.Dial(client.Options{
		HostPort: "server1.local:7233",
	})
	if err != nil {
		log.Fatalf("unable to create Temporal client", err)
	}
	defer c.Close()

	shared.SetupViper()
	// This worker hosts both Workflow and Activity functions
	w := worker.New(c, shared.GreetingTaskQueue, worker.Options{})
	w.RegisterWorkflow(temporalstuff.SendFitnessEmailWorkflow)
	w.RegisterWorkflow(temporalstuff.ObsidianThemeWorkflow)

	w.RegisterActivity(temporalstuff.SendFitnessEmailActivity)
	w.RegisterActivity(temporalstuff.LoadAndPersistObsidianThemeFile)

	// Start listening to the Task Queue
	err = w.Run(worker.InterruptCh())
	if err != nil {
		log.Fatalf("unable to start Worker", err)
	}
}
