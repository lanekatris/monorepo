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