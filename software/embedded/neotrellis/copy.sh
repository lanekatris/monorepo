# copy files to board
# ampy -p /dev/tty.usbserial-0163A05D put ./adafruit-circuitpython-bundle-8.x-mpy-20230528/lib/adafruit_neotrellis /lib/adafruit_neotrellis
# ampy -p /dev/tty.usbserial-0163A05D put ./adafruit-circuitpython-bundle-8.x-mpy-20230528/lib/adafruit_seesaw /lib/adafruit_seesaw
# ampy -p /dev/tty.usbserial-0163A05D put ./adafruit-circuitpython-bundle-8.x-mpy-20230528/lib/adafruit_bus_device /lib/adafruit_bus_device
ampy -p /dev/tty.usbserial-0163A05D put ./adafruit-circuitpython-bundle-8.x-mpy-20230528/lib/adafruit_aws_iot.mpy /lib/adafruit_aws_iot.mpy

ampy -p /dev/tty.usbserial-0163A05D -b  put ./adafruit-circuitpython-bundle-8.x-mpy-20230528/lib

# ampy -p /dev/tty.usbserial-0163A05D ls /lib
