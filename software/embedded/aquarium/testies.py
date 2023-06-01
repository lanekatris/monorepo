import time
import machine
import onewire, ds18x20

# the device is on GPIO12
dat = machine.Pin(36)

# create the onewire object
ds = ds18x20.DS18X20(onewire.OneWire(dat))

# float sensor
fl = machine.Pin(37, machine.Pin.IN, machine.Pin.PULL_UP)

# scan for devices on the bus
roms = ds.scan()
print("found devices:", roms)

# loop 10 times and print all temperatures
for i in range(100):
    print("temperatures:", end=" ")
    ds.convert_temp()
    time.sleep_ms(1000)
    for rom in roms:
        print((ds.read_temp(rom) * 1.8) + 32, end=" ")
    print()
    print("float:", end=" ")
    print(fl.value())
    print()
