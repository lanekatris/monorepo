package shared

import (
	"github.com/charmbracelet/log"
	"github.com/spf13/viper"
	"runtime"
)

const GreetingTaskQueue = "GREETING_TASK_QUEUE"
const ServerQueue = "server"

const PostgresApiKeyConfig = "POSTGRES_CONN"

var ResendApiKeyConfig = "resend_api_key"

func HandleError(err error) {
	if err != nil {
		panic(err)
	}
}

func isLinux() bool {
	return runtime.GOOS == "linux"
}

func GetPath(linuxPath string, windowsPath string) string {
	if isLinux() {
		return linuxPath
	}
	return windowsPath
}

func SetupViper() {
	viper.SetConfigName(".lk")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("$HOME")
	viper.AddConfigPath("/config")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {

			log.Info("No config file found")
			//viper.Set(cmd.InboxApiKeyConfig, "")
			//viper.Set(cmd.PostgresApiKeyConfig, "")
			//err = viper.SafeWriteConfig()
			//if err != nil {
			//	panic(err)
			//}
			//log.Info("Config file created!")
		} else {
			panic(err)
		}

	}
}
