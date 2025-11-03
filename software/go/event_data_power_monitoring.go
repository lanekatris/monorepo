package shared

type ObsidianQueueItemAdded struct {
	Message string
}
type PowerMonitoringData struct {
	Time struct {
		GetTime struct {
			Min     int `json:"min"`
			Sec     int `json:"sec"`
			Hour    int `json:"hour"`
			Mday    int `json:"mday"`
			Year    int `json:"year"`
			Month   int `json:"month"`
			ErrCode int `json:"err_code"`
		} `json:"get_time"`
		GetTimezone struct {
			Index   int `json:"index"`
			ErrCode int `json:"err_code"`
		} `json:"get_timezone"`
	} `json:"time"`
	Emeter struct {
		GetDaystat struct {
			DayList []struct {
				Day      int `json:"day"`
				Year     int `json:"year"`
				Month    int `json:"month"`
				EnergyWh int `json:"energy_wh"`
			} `json:"day_list"`
			ErrCode int `json:"err_code"`
		} `json:"get_daystat"`
		GetRealtime struct {
			ErrCode   int `json:"err_code"`
			PowerMw   int `json:"power_mw"`
			TotalWh   int `json:"total_wh"`
			CurrentMa int `json:"current_ma"`
			VoltageMv int `json:"voltage_mv"`
		} `json:"get_realtime"`
		GetMonthstat struct {
			ErrCode   int `json:"err_code"`
			MonthList []struct {
				Year     int `json:"year"`
				Month    int `json:"month"`
				EnergyWh int `json:"energy_wh"`
			} `json:"month_list"`
		} `json:"get_monthstat"`
	} `json:"emeter"`
	System struct {
		GetSysinfo struct {
			Mac        string `json:"mac"`
			HwID       string `json:"hwId"`
			Rssi       int    `json:"rssi"`
			Alias      string `json:"alias"`
			Model      string `json:"model"`
			OemID      string `json:"oemId"`
			HwVer      string `json:"hw_ver"`
			Status     string `json:"status"`
			SwVer      string `json:"sw_ver"`
			Feature    string `json:"feature"`
			LedOff     int    `json:"led_off"`
			ObdSrc     string `json:"obd_src"`
			OnTime     int    `json:"on_time"`
			DevName    string `json:"dev_name"`
			DeviceID   string `json:"deviceId"`
			ErrCode    int    `json:"err_code"`
			MicType    string `json:"mic_type"`
			Updating   int    `json:"updating"`
			IconHash   string `json:"icon_hash"`
			NtcState   int    `json:"ntc_state"`
			LatitudeI  int    `json:"latitude_i"`
			ActiveMode string `json:"active_mode"`
			LongitudeI int    `json:"longitude_i"`
			NextAction struct {
				Type int `json:"type"`
			} `json:"next_action"`
			RelayState int `json:"relay_state"`
		} `json:"get_sysinfo"`
	} `json:"system"`
	CnCloud struct {
		GetInfo struct {
			Binded        int    `json:"binded"`
			Server        string `json:"server"`
			ErrCode       int    `json:"err_code"`
			FwDlPage      string `json:"fwDlPage"`
			TcspInfo      string `json:"tcspInfo"`
			Username      string `json:"username"`
			TcspStatus    int    `json:"tcspStatus"`
			IllegalType   int    `json:"illegalType"`
			StopConnect   int    `json:"stopConnect"`
			FwNotifyType  int    `json:"fwNotifyType"`
			CldConnection int    `json:"cld_connection"`
		} `json:"get_info"`
	} `json:"cnCloud"`
	Schedule struct {
		GetRules struct {
			Enable   int   `json:"enable"`
			Version  int   `json:"version"`
			ErrCode  int   `json:"err_code"`
			RuleList []any `json:"rule_list"`
		} `json:"get_rules"`
		GetDaystat struct {
			DayList []struct {
				Day   int `json:"day"`
				Time  int `json:"time"`
				Year  int `json:"year"`
				Month int `json:"month"`
			} `json:"day_list"`
			ErrCode int `json:"err_code"`
		} `json:"get_daystat"`
		GetRealtime struct {
			ErrMsg  string `json:"err_msg"`
			ErrCode int    `json:"err_code"`
		} `json:"get_realtime"`
		GetMonthstat struct {
			ErrCode   int `json:"err_code"`
			MonthList []struct {
				Time  int `json:"time"`
				Year  int `json:"year"`
				Month int `json:"month"`
			} `json:"month_list"`
		} `json:"get_monthstat"`
		GetNextAction struct {
			Type    int `json:"type"`
			ErrCode int `json:"err_code"`
		} `json:"get_next_action"`
	} `json:"schedule"`
	AntiTheft struct {
		GetRules struct {
			Enable   int   `json:"enable"`
			Version  int   `json:"version"`
			ErrCode  int   `json:"err_code"`
			RuleList []any `json:"rule_list"`
		} `json:"get_rules"`
		GetNextAction struct {
			ErrMsg  string `json:"err_msg"`
			ErrCode int    `json:"err_code"`
		} `json:"get_next_action"`
	} `json:"anti_theft"`
}
type WaterLevelData struct {
	Data int `json:"data"`
}
