#!/usr/bin/env bash
## cronchgif.sh
#
set -e

[ ! -z "${DEBUG}" ] && set -x

if [ $# -ne 2 ]; then
	echo "usage: cronchgif.sh <input> <output>"
	exit 2
fi

input="${1}"
output="${2}"
#
#
#ffmpeg -i "${input}" -vf "fps=30,scale='if(gt(iw,800),800,iw)':'if(gt(iw,800),-2,ih)'" -c:v pam -f image2pipe - | \
#    convert -delay 3 - -loop 0 -layers optimize gif:- | \
#    ffmpeg -i - -movflags faststart -pix_fmt yuv420p \
#    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${output}"


#ffmpeg -i "${input}" -vf "scale=400:400,fps=15,palettegen" -y palette.png
#
#ffmpeg -i "${input}" -i palette.png -filter_complex "[0:v]fps=15,scale=400:400[v];[v][1:v]paletteuse" -loop 0 "${output}"
#convert "${output}" -layers Optimize output-optimized.gif

#original inspiration from: https://xeiaso.net/notes/2024/cronchgif/
ffmpeg -i "${input}" -vf "scale=400:400,fps=15" -an -loop 1 "${output}"

