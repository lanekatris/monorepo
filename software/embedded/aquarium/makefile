copy-test:
	rshell -p /dev/ttyACM0 cp testies.py /pyboard
erase:
	esptool.py --chip esp32s3 --port /dev/ttyACM0 erase_flash
install-os:
	esptool.py -b 115200 --chip esp32s3 --port /dev/ttyACM0 write_flash -z 0 /home/lane/Downloads/firmware.bin
install-os2:
	esptool.py -b 115200 --chip esp32s3 --port /dev/ttyACM0 write_flash -z 0 /home/lane/Downloads/GENERIC_S3_SPIRAM_OCT-20230426-v1.20.0.bin
run-test:
	ampy -p /dev/ttyACM0 run ./testies.py
repl:
	putty -serial /dev/ttyACM0
copy:
	ampy -b 115200 -p /dev/ttyACM0 put ./floatsensor.py
	ampy -b 115200 -p /dev/ttyACM0 put ./tempsensor.py
	ampy -b 115200 -p /dev/ttyACM0 put ./umqtt
	ampy -b 115200 -p /dev/ttyACM0 put ./config.json
	ampy -b 115200 -p /dev/ttyACM0 put ./config.py
	ampy -b 115200 -p /dev/ttyACM0 put ./wifi.py
	ampy -b 115200 -p /dev/ttyACM0 put ./cert.pem.crt
	ampy -b 115200 -p /dev/ttyACM0 put ./private.pem.key
	ampy -b 115200 -p /dev/ttyACM0 put ./main.py
