package shared

import (
	"encoding/json"
	"errors"
	"github.com/charmbracelet/log"
	"github.com/spf13/viper"
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

	var token string
	err := workflow.ExecuteActivity(ctx, GetTwitchToken, clientId, secret).Get(ctx, &token)
	if err != nil {
		return err
	}

	twitchStreams := []string{"headshotchick", "theprimeagen", "beardedblevins", "ninja", "sweeettails"}

	for _, twitchStream := range twitchStreams {
		var stream *StreamData
		err = workflow.ExecuteActivity(ctx, GetStreamByUserID, clientId, token, twitchStream).Get(ctx, &stream)

		if err != nil {
			return err
		}

		if stream == nil {
			log.Info("stream not live")
			continue
		}

		stringStream, err := json.Marshal(stream)
		if err != nil {
			return err
		}

		var activities *SharedActivities
		err = workflow.ExecuteActivity(ctx, activities.DumpEvent, "twitch_stream_online_v1", string(stringStream)).Get(ctx, nil)

		return err
	}

	return err
}
