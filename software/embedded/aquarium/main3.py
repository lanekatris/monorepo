import os
import time
import ujson
import sys
import machine
import network
import onewire, ds18x20

from umqtt.simple import MQTTClient

private_key = "private.pem.key"
private_cert = "cert.pem.crt"
config_file = "config.json"

# Read the files used to authenticate to AWS IoT Core
with open(private_key, "r") as f:
    key = f.read()
with open(private_cert, "r") as f:
    cert = f.read()
with open(config_file, "r") as f:
    settings_string = f.read()
    settings = ujson.loads(settings_string)
    wifi_ssid = settings["wifi"]["ssid"]
    wifi_password = settings["wifi"]["password"]
    aws_endpoint = bytes(settings["aws"]["endpoint"], "utf-8")
    thing_name = settings["aws"]["thing_name"]
    client_id = settings["aws"]["thing_client"]

# These are the topics we will subscribe to. We will publish updates to /update.
# We will subscribe to the /update/delta topic to look for changes in the device shadow.
topic_pub = "$aws/things/" + thing_name + "/testies"
ssl_params = {"key": key, "cert": cert, "server_side": False}

info = os.uname()

temp_pin = machine.Pin(7)
temp_onewire = ds18x20.DS18X20(onewire.OneWire(temp_pin))
float_pin = machine.Pin(17, machine.Pin.IN, machine.Pin.PULL_UP)

roms = temp_onewire.scan()
print("found devices:", roms)

# Connect to the wireless network
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
if not wlan.isconnected():
    print("Connecting to network...")
    wlan.connect(wifi_ssid, wifi_password)
    while not wlan.isconnected():
        pass

    print("Connection successful")
    print("Network config:", wlan.ifconfig())


def mqtt_connect(client=client_id, endpoint=aws_endpoint, sslp=ssl_params):
    mqtt = MQTTClient(
        client_id=client,
        server=endpoint,
        port=8883,
        keepalive=4000,
        ssl=True,
        ssl_params=sslp,
    )
    print("Connecting to AWS IoT...")
    mqtt.connect()
    print("Done")
    return mqtt


def mqtt_publish(client, topic=topic_pub, message=""):
    print("Publishing message...")
    client.publish(topic, message)
    print(message)


while True:
    try:
        mqtt = mqtt_connect()
    except Exception as e:
        print("Unable to connect to MQTT.")
        print(e)
        print(sys.print_exception(e))

    # Check for messages.
    try:
        mqtt.check_msg()
    except Exception as e:
        print("Unable to check for messages.")
        print(e)

    temp_onewire.convert_temp()
    time.sleep_ms(1000)  # This is needed before querying for temperature

    mesg = ujson.dumps(
        {
            "device": {
                "client": client_id,
                "uptime": time.ticks_ms(),
                "hardware": info[0],
                "firmware": info[2],
            },
            "sensors": {
                "temperature": (temp_onewire.read_temp(roms[0]) * 1.8) + 32,
                "float": float_pin.value(),
            },
        }
    )

    # Using the message above, the device shadow is updated.
    try:
        mqtt_publish(client=mqtt, message=mesg)
    except Exception as e:
        print("Unable to publish message.")
        print(e)

    # Wait for 30 minutes before checking for messages and publishing a new update.
    print("Sleep for 30 minutes")
    # time.sleep(60 * 30)
    time.sleep(10)
