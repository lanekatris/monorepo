test:
	ampy -p /dev/ttyUSB0 run neo.py

repl:
	putty -serial /dev/ttyUSB0

erase:
	esptool.py --chip esp32 --port /dev/ttyUSB0 erase_flash

install:
	esptool.py --chip esp32 --port /dev/ttyUSB0 --baud 460800 write_flash -z 0x1000 /home/lane/Downloads/esp32-20230426-v1.20.0.bin
