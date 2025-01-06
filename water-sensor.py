from machine import Pin, deepsleep, ADC, reset_cause
from time import sleep, sleep_ms


import json
import urequests

ssid = 'XXXX'
password='XXXX'

water_data_pin = ADC(Pin(7))
water_power_pin = Pin(15, Pin.OUT)





def do_connect():
    import network
    wlan = network.WLAN(network.WLAN.IF_STA)
    wlan.active(True)
    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect(ssid, password)
        while not wlan.isconnected():
            pass
        print('network config:', wlan.ipconfig('addr4'))


# would be nice to easily toggle deepsleep vs sleep via a function call
# while True:
print(f"coming on, reset cause: {reset_cause()}...")
water_power_pin.on()

do_connect()

value = water_data_pin.read()
print(f"water exists value: {value}")

print("Sending to api...")
url = 'http://192.168.86.100:3333/api/dump/water_level_v1?token=XXXXX'
data = {'data': value}
res = urequests.post(url, data=json.dumps(data))
print('Server response: ' + res.text)

print("deepsleeping in 10s")
sleep(10)
water_power_pin.off()

print("deepsleeping")
#deepsleep(10000)
deepsleep(1000 * 60 * 30) # 30 minutes
#sleep(5)
    
    
    
    
    
    
    