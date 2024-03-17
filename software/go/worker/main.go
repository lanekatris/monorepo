package main

import (
	"github.com/charmbracelet/log"
	_ "github.com/lib/pq"
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

	db, err := shared.GetDb()
	shared.HandleError(err)

	var activities = &shared.ObsidianAdventuresActivityInput{Db: db}

	w.RegisterWorkflow(shared.LoadObsidianAdventuresWorkflow)
	//w.RegisterActivity(shared.DeleteAdventureData, db)
	w.RegisterActivity(activities)

	// Start listening to the Task Queue
	err = w.Run(worker.InterruptCh())
	if err != nil {
		log.Fatalf("unable to start Worker", err)
	}
}
