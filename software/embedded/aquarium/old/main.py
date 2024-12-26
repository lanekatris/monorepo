import os
import time
import ujson
import sys
import config
import wifi
import tempsensor
import floatsensor
from machine import Timer

from umqtt.simple import MQTTClient

c = config.AquaConfig()
c.load()

# These are the topics we will subscribe to. We will publish updates to /update.
# We will subscribe to the /update/delta topic to look for changes in the device shadow.
topic_pub = "$aws/things/" + c.thing_name + "/testies"
ssl_params = {"key": c.private_key, "cert": c.private_cert, "server_side": False}

info = os.uname()

wifi.connect_to_wifi(c.wifi_ssid, c.wifi_password)
def mqtt_connect(client=c.client_id, endpoint=c.aws_endpoint, sslp=ssl_params):
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


def go(t):
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

    mesg = ujson.dumps(
        {
            "device": {
                "client": c.client_id,
                "uptime": time.ticks_ms(),
                "hardware": info[0],
                "firmware": info[2],
            },
            "sensors": {
                "temperature": tempsensor.get_temperature(7),
                "float": floatsensor.get_float(17),
            },
        }
    )

    # Using the message above, the device shadow is updated.
    try:
        mqtt_publish(client=mqtt, message=mesg)
    except Exception as e:
        print("Unable to publish message.")
        print(e)

    try:
        mqtt.disconnect()
    except Exception as e:
        print("Unable to disconnect")
        print(e)

t0 = Timer(0)
t0.init(period=1800000, mode=Timer.PERIODIC, callback=go)
print("Timer set. Wait for logs")
go("")