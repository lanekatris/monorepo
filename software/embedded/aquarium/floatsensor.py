import machine

def get_float(pin_num):
    fl = machine.Pin(pin_num, machine.Pin.IN, machine.Pin.PULL_UP)
    return fl.value()