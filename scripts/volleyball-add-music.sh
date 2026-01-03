# ffmpeg \
#   -i /home/lane/Videos/Volleyball/2025-12-01/2025-12-01/GOPR4005.MP4 \
#   -stream_loop -1 -i /home/lane/Downloads/soaring.mp3 \
#   -filter_complex "afade=t=in:ss=0:d=3,afade=t=out:st=57:d=3" \
#   -map 0:v \
#   -map 1:a \
#   -c:v copy \
#   -c:a aac \
#   -shortest \
#   /home/lane/Downloads/output-with-audio.mp4
#
# -i /home/lane/Videos/Volleyball/2025-12-01/2025-12-01/GOPR4005.MP4 \

# This was done as I was getting out of space errors
TMPDIR=$HOME/tmp \
  ffmpeg \
  -fflags +nobuffer \
  -flags low_delay \
  -max_delay 0 \
  -analyzeduration 0 \
  -probesize 32k \
  -i /home/lane/Videos/Volleyball/2025-12-22/output.MP4 \
  -stream_loop -1 -i /home/lane/monorepo/scripts/soaring.mp3 \
  -map 0:v \
  -map 1:a \
  -c:v copy \
  -c:a aac \
  -movflags +faststart+frag_keyframe+empty_moov \
  -shortest \
  /home/lane/Videos/Volleyball/2025-12-22/output-with-audio-allofit.mp4
