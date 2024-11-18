import wifi
import config
import ujson

c = config.AquaConfig()
c.load()

print(ujson.dumps(c))
wifi.connect_to_wifi(c.wifi_ssid, c.wifi_password)

print("lets gooooo!!")