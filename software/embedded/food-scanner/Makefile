
setup:
	ssh-copy-id pi@kitchenpi


deploy:
	echo "did you change the deploy key?"
	scp ./watch-keyboard.py pi@kitchenpi:/home/pi/scanme.py
	scp ./barcode.service pi@kitchenpi:/home/pi/barcode_scanner.service
	ssh -t pi@kitchenpi "sudo mv /home/pi/barcode_scanner.service /etc/systemd/system/barcode_scanner.service && \
		sudo systemctl enable barcode_scanner.service && \
		sudo systemctl start barcode_scanner.service && \
		sudo systemctl status barcode_scanner.service"

	echo "you need to reboot, make sure the scanner is plugged in and the monitor is UNPLUGGED"
	echo "make sure you make readonly filesystem: https://learn.adafruit.com/read-only-raspberry-pi/overview"
