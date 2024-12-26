import machine, neopixel

np = neopixel.NeoPixel(machine.Pin(38), 1)

np[0] = (0,0,64)
np.write()