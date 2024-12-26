from machine import Pin, deepsleep
from time import sleep
from machine import ADC
import network
import json
import urequests

# pin 20 = water data
# pin 21 = power
# gnd = 
ssid = 'xxx
password='xxxx'

led = machine.Pin("LED", machine.Pin.OUT)
water_data_pin = Pin(20, Pin.IN)
water_power_pin = Pin(21, Pin.OUT)
battery_adc = ADC(26)  # Connect the battery output (via a voltage divider if needed) to ADC0 (GPIO 26)
temperature_sensor = ADC(4)

# Voltage divider resistor values (adjust if different)
R1 = 10000  # 10k ohms
R2 = 10000  # 10k ohms

# Pico ADC conversion factors
conversion_factor = 3.3 / 65535  # 3.3V reference and 16-bit resolution



def read_battery_voltage():
    # Read raw ADC value
    raw_value = battery_adc.read_u16()
    # Convert to voltage
    measured_voltage = raw_value * conversion_factor
    # Compensate for the voltage divider
    battery_voltage = measured_voltage * ((R1 + R2) / R2)
    return battery_voltage

def read_temperature():
    # Read the raw ADC value
    raw_value = temperature_sensor.read_u16()
    # Convert the raw ADC value to voltage
    voltage = raw_value * conversion_factor
    # Convert the voltage to temperature in Celsius
    # Formula from the Raspberry Pi Pico datasheet
    temperature_c = 27 - (voltage - 0.706) / 0.001721
    temperature_f = temperature_c * 9 / 5 + 32
    return temperature_f

def connect():
    #Connect to WLAN
    print("Connecting to wifi...")
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    while wlan.isconnected() == False:
        print('Waiting for connection...')
        sleep(1)
    print(wlan.ifconfig())
    
try:
    connect()
except KeyboardInterrupt:
    machine.reset()

while True:
    led.on()
    water_power_pin.on()
    value = water_data_pin.value()
    print(f"water exists value: {value}")  # Print the value to the console
    voltage = read_battery_voltage()
    print(f"Battery Voltage: {voltage:.2f} V")
    
    temperature = read_temperature()
    print(f"Temperature: {temperature:.2f} °F")
    
    print("Sending to api...")
    url = 'http://192.168.86.100:3333/api/dump/water_level_v1?token=XXXXXXXXX'
    data = {'data': value}
    res = urequests.post(url, data=json.dumps(data))
    print('Server response: ' + res.text)
    
    print("going to sleep...")
    water_power_pin.off()
    led.off()
    deepsleep(3000)
    #sleep(5)

# wifi