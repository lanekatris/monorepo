import machine, onewire, ds18x20, time
import network
import machine
import urequests
import json

ssid = 'XXXXXXXXXXX'
password='XXXXXXXXX'

ds_pin = machine.Pin(3)
ds_sensor = ds18x20.DS18X20(onewire.OneWire(ds_pin))

led = machine.Pin("LED", machine.Pin.OUT)

def connect():
    #Connect to WLAN
    print("Connecting to wifi...")
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    while wlan.isconnected() == False:
        print('Waiting for connection...')
        time.sleep(1)
    print(wlan.ifconfig())
    
try:
    connect()
except KeyboardInterrupt:
    machine.reset()

roms = ds_sensor.scan()
print('Found DS devices: ', roms)

while True:
  ds_sensor.convert_temp()
  time.sleep_ms(750)
  for rom in roms:
    #print(rom)
    tempC = ds_sensor.read_temp(rom)
    tempF = tempC * (9/5) +32
    
    led.on()
    print("Sending to api...")
    url = 'http://192.168.86.100:3333/api/dump/aquarium_temperature_v1?token=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    data = {'temperatureF': tempF}
    res = urequests.post(url, data=json.dumps(data))
    print('Server response: ' + res.text)
    led.off()
    
    #print('temperature (ºC):', "{:.2f}".format(tempC))
    print('temperature (ºF):', "{:.2f}".format(tempF))
    print()
  time.sleep(60 * 30) # 30min