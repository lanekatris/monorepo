package shared

import (
	"encoding/json"
	"errors"
	"github.com/charmbracelet/log"
	"github.com/spf13/viper"
	"go.temporal.io/api/enums/v1"
	"go.temporal.io/sdk/workflow"
	"time"
)

func WorkflowTwitch(ctx workflow.Context) error {
	options := workflow.ActivityOptions{
		StartToCloseTimeout: time.Minute * 1,
	}

	ctx = workflow.WithActivityOptions(ctx, options)

	var secret = viper.GetString("twitch_secret")
	if secret == "" {
		return errors.New("twitch_secret is empty")
	}
	var clientId = viper.GetString("twitch_client_id")
	if clientId == "" {
		return errors.New("twitch_client_id is empty")
	}

	// get token
	var token string
	err := workflow.ExecuteActivity(ctx, KvGetString, "twitch-token").Get(ctx, &token)
	if err != nil {
		return err
	}

	if token == "" {
		var newToken string
		err := workflow.ExecuteActivity(ctx, GetTwitchToken, clientId, secret).Get(ctx, &newToken)
		if err != nil {
			return err
		}
		token = newToken

	}

	twitchStreams := [4]string{"headshotchick", "theprimeagen", "beardedblevins", "ninja"}

	for _, twitchStream := range twitchStreams {
		var stream *StreamData
		err = workflow.ExecuteActivity(ctx, GetStreamByUserID, clientId, token, twitchStream).Get(ctx, &stream)

		if err != nil {
			return err
		}

		if stream == nil {
			log.Info("stream not live")
			return nil
		}

		stringStream, err := json.Marshal(stream)
		if err != nil {
			return err
		}

		childOptions := workflow.ChildWorkflowOptions{
			WorkflowID:        "dump-from-twitch",
			TaskQueue:         ServerQueue,
			ParentClosePolicy: enums.PARENT_CLOSE_POLICY_TERMINATE,
		}
		ctx = workflow.WithChildOptions(ctx, childOptions)

		err = workflow.ExecuteChildWorkflow(ctx, WorkflowDumper, "twitch_stream_online_v1", string(stringStream)).Get(ctx, nil)
		if err != nil {
			return err
		}
	}

	return err
}
