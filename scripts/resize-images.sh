#!/usr/bin/env bash
#echo "hi $1"

if [ -z "$1" ]; then
  echo "Please provide a directory path."
  exit 1
fi

directory=$1

shopt -s nullglob

for file in "$directory"/*.{jpg,png}; do
  if [[ $file =~ "small" ]]; then
	  echo "not processing $file"
  else
	  justname=$(basename $file .jpg)
	  justname=$(basename $file .png)
    echo "Processing $justname"
    convert $file -resize x400 "$directory/${justname}_small.webp"
  fi
done

shopt -u nullglob