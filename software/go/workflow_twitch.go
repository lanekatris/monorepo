package shared

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/charmbracelet/log"
	"github.com/spf13/viper"
	"go.temporal.io/api/enums/v1"
	"go.temporal.io/sdk/workflow"
	"net/http"
	"net/url"
	"strings"
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

	// login
	if token == "" {
		// login and set token
		//newToken, err := GetTwitchToken(clientId, secret)
		//if err != nil {
		//	return err
		//}
		//token = newToken

		var newToken string
		err := workflow.ExecuteActivity(ctx, GetTwitchToken, clientId, secret).Get(ctx, &newToken)
		if err != nil {
			return err
		}
		token = newToken

	}

	// make request
	var stream *StreamData
	err = workflow.ExecuteActivity(ctx, GetStreamByUserID, clientId, token, "headshotchick").Get(ctx, &stream)

	//stream, err := GetStreamByUserID(clientId, token, "beardedblevins")
	if err != nil {
		return err
	}

	if stream == nil {
		log.Info("stream not live")
		return nil
	}

	// kvput
	//var activities *WorkflowInputDumper

	stringStream, err := json.Marshal(stream)
	if err != nil {
		return err
	}

	//_, err = c.ExecuteWorkflow(context.Background(), options, shared.LoadObsidianAdventuresWorkflow)
	childOptions := workflow.ChildWorkflowOptions{
		WorkflowID:        "dump-from-twitch",
		TaskQueue:         ServerQueue,
		ParentClosePolicy: enums.PARENT_CLOSE_POLICY_TERMINATE,
		//WorkflowIDReusePolicy: enums.WORKFLOW_ID_REUSE_POLICY_ALLOW_DUPLICATE,
	}
	ctx = workflow.WithChildOptions(ctx, childOptions)

	err = workflow.ExecuteChildWorkflow(ctx, WorkflowDumper, "twitch_stream_online_v1", string(stringStream)).Get(ctx, nil)

	//err = workflow.ExecuteActivity(ctx, activities.DumpEvent, "twitch_stream_online_v1", string(stringStream)).Get(ctx, nil)
	return err
}

const (
	twitchTokenURL = "https://id.twitch.tv/oauth2/token"
)

type TwitchTokenResponse struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
	TokenType   string `json:"token_type"`
}

func GetTwitchToken(clientID, clientSecret string) (string, error) {
	data := url.Values{}
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("grant_type", "client_credentials")

	resp, err := http.Post(
		twitchTokenURL,
		"application/x-www-form-urlencoded",
		strings.NewReader(data.Encode()),
	)
	if err != nil {
		return "", fmt.Errorf("failed to request token: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("token request failed: %s", resp.Status)
	}

	var tokenResp TwitchTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", fmt.Errorf("failed to decode token response: %w", err)
	}

	return tokenResp.AccessToken, nil
}

const twitchStreamsURL = "https://api.twitch.tv/helix/streams"

type StreamData struct {
	ID           string `json:"id"`
	UserID       string `json:"user_id"`
	UserName     string `json:"user_name"`
	GameID       string `json:"game_id"`
	Title        string `json:"title"`
	ViewerCount  int    `json:"viewer_count"`
	StartedAt    string `json:"started_at"`
	Language     string `json:"language"`
	ThumbnailURL string `json:"thumbnail_url"`
}

type StreamsResponse struct {
	Data []StreamData `json:"data"`
}

func GetStreamByUserID(clientID, token, userID string) (*StreamData, error) {
	// Prepare URL with query param
	u, _ := url.Parse(twitchStreamsURL)
	q := u.Query()
	q.Set("user_login", userID)
	u.RawQuery = q.Encode()

	// Prepare request
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, fmt.Errorf("creating request failed: %w", err)
	}
	req.Header.Set("Client-Id", clientID)
	req.Header.Set("Authorization", "Bearer "+token)

	// Execute request
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Decode response
	var streamResp StreamsResponse
	if err := json.NewDecoder(resp.Body).Decode(&streamResp); err != nil {
		return nil, fmt.Errorf("decoding response failed: %w", err)
	}

	// If stream is live, it will be in the "data" array
	if len(streamResp.Data) == 0 {
		return nil, nil // Not live
	}

	return &streamResp.Data[0], nil
}
