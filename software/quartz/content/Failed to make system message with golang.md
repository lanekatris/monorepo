---
pubDate: 2025-09-23
---
For my volleyball video processing code: [[Working with volleyball videos]] I wanted to show a system notification when it was done joining 28GB of videos together using ffmpeg. Usually I run the program and multitask elsewhere on a different desktop workspace.

Was playing with https://github.com/gen2brain/beeep

I'm running on nixos and got this error:
```
panic: beeep: dbus: unexpected EOF; notify-send: exec: "notify-send": executable file not found in $PATH; kdialog: exec: "kdialog": executable file not found in $PATH
```

So I gave up since I wanted a quick win. I'll come back to it some day.