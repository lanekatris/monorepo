import tempsensor
import floatsensor

for i in range(100):
    print("temperatures:", end=" ")
    print(tempsensor.get_temperature(7), end=" ")
    print()
    print("float:", end=" ")

    print(floatsensor.get_float(17))
    print()
