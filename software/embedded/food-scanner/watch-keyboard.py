import os
import requests

# HID key code to character mapping for a US keyboard layout
HID_KEY_MAP = {
    0x04: 'a', 0x05: 'b', 0x06: 'c', 0x07: 'd', 0x08: 'e', 0x09: 'f', 0x0A: 'g',
    0x0B: 'h', 0x0C: 'i', 0x0D: 'j', 0x0E: 'k', 0x0F: 'l', 0x10: 'm', 0x11: 'n',
    0x12: 'o', 0x13: 'p', 0x14: 'q', 0x15: 'r', 0x16: 's', 0x17: 't', 0x18: 'u',
    0x19: 'v', 0x1A: 'w', 0x1B: 'x', 0x1C: 'y', 0x1D: 'z',
    0x1E: '1', 0x1F: '2', 0x20: '3', 0x21: '4', 0x22: '5', 0x23: '6', 0x24: '7',
    0x25: '8', 0x26: '9', 0x27: '0', 0x28: '\n', 0x2C: ' ', 0x2D: '-', 0x2E: '=',
    0x2F: '[', 0x30: ']', 0x31: '\\', 0x33: ';', 0x34: "'", 0x36: ',', 0x37: '.',
    0x38: '/', 0x2A: '[Backspace]'
}

MODIFIER_SHIFT = 0x02  # Shift key modifier bit

def decode_hidraw(hidraw_device):
    buffer = ""  # To accumulate characters for the current barcode

    with open(hidraw_device, "rb") as device:
        print(f"Listening to {hidraw_device} for barcode scans...")
        while True:
            data = device.read(8)  # Read 8-byte HID report
            modifier = data[0]
            keycode = data[2]

            if keycode == 0:  # No key pressed
                continue

            # Check for Shift modifier
            shift = (modifier & MODIFIER_SHIFT) != 0

            # Get the corresponding character
            char = HID_KEY_MAP.get(keycode, '')
            if shift and char.isalpha():
                char = char.upper()

            if keycode == 0x28:  # Enter key (end of barcode)
                if buffer:
                    print(f"Scanned Barcode: {buffer}")  # Print the full barcode
                    # TODO: Could pull from env variable
                    url = 'http://192.168.86.100:3333/api/dump/barcode_scanned_v1?token=XXXXXXXX'
                    data = {'barcode': buffer}
                    r = requests.post(url, json = data)
                    print(f"Response: {r.reason}")
                    buffer = ""  # Clear buffer for the next scan
            elif char:
                buffer += char  # Accumulate characters

# Update with your HID device path
HID_DEVICE = "/dev/hidraw0"

try:
    decode_hidraw(HID_DEVICE)
except KeyboardInterrupt:
    print("\nExiting.")
except FileNotFoundError:
    print(f"Device {HID_DEVICE} not found. Check your connection.")
