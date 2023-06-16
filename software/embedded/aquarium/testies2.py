# lets test around with some scheduled thingies
import time
import tempsensor
import floatsensor
from machine import Timer

def dowork(t):
    print("temperatures:", end=" ")
    print(tempsensor.get_temperature(7), end=" ")
    print()
    print("float:", end=" ")

    print(floatsensor.get_float(17))
    print()

testies = Timer(0)
testies.init(period=5000, mode=Timer.PERIODIC, callback=dowork)

while True:
    time.sleep(1)