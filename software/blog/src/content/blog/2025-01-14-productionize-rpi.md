---
title: "Productionize Homelab Raspberry Pi"
pubDate: "2025-01-14"
tags:
  - rpi
---

# Problem

My kitchen rpi died [here](/notes/20250114_115323). Probably the most irritating thing about Raspberry Pi's in my
opinion is the SD
cards get corrupt with power blips.

I don't even mind the slowness of them apt-getting or waiting to connect via `ssh`.

# How to fix

I looked up "production-izing your rpi" and
found [this Adafruit article](https://learn.adafruit.com/read-only-raspberry-pi/overview).

My app doesn't need write access to the SD so a readonly filesystem sounds great.

# Outcome

I tried this, rebooted, and could touch a file... and that file survived during another reboot.

I give up. I did create a backup of the whole SD with `dd`
mentioned [here](https://raspberrystreet.com/learn/how-to-backup-raspberrypi-sdcard).

(Private Link) [My rpi backups](http://server1.local:9001/browser/backup/rpi%2F)

An example how to copy my 30GB SD card backup to my minio server:

```shell
mc cp /media/lane/Old_School_HDD/main-backup.img server1/backup/rpi/main_backup.img
```

Wish me luck staying away from corruption!