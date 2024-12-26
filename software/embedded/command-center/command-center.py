from machine import Pin
import time
import network
import urequests
import json

ssid = 'XXXXXXX'
password='XXXXXXXX'

# Define the pins for the toggle switches
switch_pins = [Pin(19, Pin.IN, Pin.PULL_DOWN),  
               Pin(20, Pin.IN, Pin.PULL_DOWN), 
               Pin(21, Pin.IN, Pin.PULL_DOWN),  
               Pin(22, Pin.IN, Pin.PULL_DOWN)]  

# Initialize the last known states for the switches
last_states = [None, None, None, None]

def connect():
    #Connect to WLAN
    print("Connecting to wifi...")
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(ssid, password)
    while wlan.isconnected() == False:
        print('Waiting for connection...')
        time.sleep(1)
    print(wlan.ifconfig())


# Define actions for each switch
def handle_switch(switch_id, state):
    if state:
        print(f"Switch {switch_id} is ON")
        # Add your 'ON' action for this switch
    else:
        print(f"Switch {switch_id} is OFF")
        # Add your 'OFF' action for this switch
        
        
try:
    connect()
except KeyboardInterrupt:
    machine.reset()

while True:
    # Check each switch
    for i, switch in enumerate(switch_pins):
        current_state = switch.value()  # 1 if ON, 0 if OFF

        if current_state != last_states[i]:  # State has changed
            handle_switch(i + 1, current_state)  # Pass switch ID (1-based) and state
            last_states[i] = current_state  # Update the last known state
            print("Sending to api...")
            url = 'http://192.168.86.100:3333/api/dump/toggle_switched_v1?token=XXXXXXXXXXX'
            data = {'switch_id': f"troy_control_panel_{i+1}", 'value':current_state}
            res = urequests.post(url, data=json.dumps(data))
            print('Server response: ' + res.text)

    time.sleep(0.1)  # Small delay to debounce
