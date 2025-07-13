package shared

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type Light struct {
	On          int `json:"on"`
	Brightness  int `json:"brightness"`
	Temperature int `json:"temperature"`
}

type LightResponse struct {
	NumberOfLights int     `json:"numberOfLights"`
	Lights         []Light `json:"lights"`
}

var elgatoUrl = "http://192.168.4.39:9123/elgato/lights"

func ToggleElgatoLight() error {
	data, err := getElgatoLight()
	if err != nil {
		return err
	}

	if data.Lights[0].On == 1 {
		// turn it off
		err = turnOnElgatoLight(0)
		if err != nil {
			return err
		}
	} else {
		// turn it on
		err = turnOnElgatoLight(1)
		if err != nil {
			return err
		}
	}
	return nil
}

func getElgatoLight() (*LightResponse, error) {
	resp, err := http.Get(elgatoUrl)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, err
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var result LightResponse
	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, err
	}

	return &result, nil

}

func turnOnElgatoLight(onOrOff int) error {
	payload := map[string]interface{}{
		"numberOfLights": 1,
		"lights": []map[string]interface{}{
			{
				"on":          onOrOff,
				"brightness":  45,
				"temperature": 143,
			},
		},
	}

	// Encode to JSON
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	// Make the PUT request
	req, err := http.NewRequest("PUT", elgatoUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	fmt.Println("Status:", resp.Status)
	return nil
}
