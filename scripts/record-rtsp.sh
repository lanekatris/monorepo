ffmpeg  -hide_banner -y -loglevel error -rtsp_transport tcp -use_wallclock_as_timestamps 1
-i /dev/video0  -vcodec copy -acodec copy -f segment -reset_timestamps 1 -segment_time 30
-metadata:s:v:0 testies="$(date +%Y-%m-%dT%H:%M:%SZ)"  -segment_format mkv -segment_atclocktime 1 -strftime 1 %Y%m%dT%H%M%S.mkv
