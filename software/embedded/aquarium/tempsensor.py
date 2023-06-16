import time
import machine
import onewire, ds18x20

def get_temperature(pin_num):
    dat = machine.Pin(pin_num)
    ds = ds18x20.DS18X20(onewire.OneWire(dat))
    roms = ds.scan()
    ds.convert_temp()
    time.sleep_ms(1000)
    return (ds.read_temp(roms[0]) * 1.8) + 32