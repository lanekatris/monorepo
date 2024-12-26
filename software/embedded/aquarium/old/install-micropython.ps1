esptool.py.exe --chip esp32s3 --port COM4 erase_flash
write-host "sleeping 5 seconds..."
start-sleep -seconds 5
esptool.py.exe -b 115200 --chip esp32s3 --port COM4 write_flash -z 0 ./GENERIC_S3-20220117-v1.18.bin