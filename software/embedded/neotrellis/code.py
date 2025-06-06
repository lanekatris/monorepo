

import time
import board
from adafruit_neotrellis.neotrellis import NeoTrellis
import wifi  # Only for boards with built-in Wi-Fi like ESP32-S2/S3 or Pico W
import socketpool
import adafruit_requests
import json

# Wi-Fi credentials
WIFI_SSID = "xxxx"
WIFI_PASSWORD = "xxxx"

# Connect to Wi-Fi
print("Connecting to Wi-Fi...")
wifi.radio.connect(WIFI_SSID, WIFI_PASSWORD)
print("Connected to", WIFI_SSID)

# Set up requests
pool = socketpool.SocketPool(wifi.radio)
requests = adafruit_requests.Session(pool)

# create the i2c object for the trellis
i2c_bus = board.I2C()  # uses board.SCL and board.SDA
# i2c_bus = board.STEMMA_I2C()  # For using the built-in STEMMA QT connector on a microcontroller

# create the trellis
trellis = NeoTrellis(i2c_bus)

# Set the brightness value (0 to 1.0)
trellis.brightness = 0.5

# some color definitions
OFF = (0, 0, 0)
RED = (255, 0, 0)
YELLOW = (255, 150, 0)
GREEN = (0, 255, 0)
CYAN = (0, 255, 255)
BLUE = (0, 0, 255)
PURPLE = (180, 0, 255)


# this will be called when button events are received
def blink(event):
    # turn the LED on when a rising edge is detected
    if event.edge == NeoTrellis.EDGE_RISING:
        trellis.pixels[event.number] = CYAN
        print(f"you pressed {event.number}")
        try:
            print("Sending HTTP request...")
            url = "http://192.168.86.100:3333/api/dump/neotrellis_v1?token=XXXXXXXXXX"
            headers = { "Content-Type": "application/json" }
            data = json.dumps({"buttonId": event.number})

            response = requests.post(url, headers=headers, data=data)
            print("Response:", response.status_code, response.text)
            response.close()
        except Exception as e:
            print("Request failed:", e)

    # turn the LED off when a falling edge is detected
    elif event.edge == NeoTrellis.EDGE_FALLING:
        trellis.pixels[event.number] = OFF


for i in range(16):
    # activate rising edge events on all keys
    trellis.activate_key(i, NeoTrellis.EDGE_RISING)
    # activate falling edge events on all keys
    trellis.activate_key(i, NeoTrellis.EDGE_FALLING)
    # set all keys to trigger the blink callback
    trellis.callbacks[i] = blink

    # cycle the LEDs on startup
    trellis.pixels[i] = PURPLE
    time.sleep(0.05)

for i in range(16):
    trellis.pixels[i] = OFF
    time.sleep(0.05)

while True:
    # call the sync function call any triggered callbacks
    trellis.sync()
    # the trellis can only be read every 17 millisecons or so
    time.sleep(0.02)
