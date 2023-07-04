#!/bin/sh

# xrandr --listmonitors
# Monitors: 3
# 0: +*HDMI-1 3440/800x1440/335+0+0  HDMI-1
# 1: +HDMI-0 3440/800x1440/335+3440+0  HDMI-0
# 2: +HDMI-1-1 1920/521x1080/293+6880+0  HDMI-1-1
xrandr --output HDMI-1 --auto --primary
xrandr --output HDMI-0 --auto --right-of HDMI-1
xrandr --output HDMI-1-1 --auto --right-of HDMI-0
