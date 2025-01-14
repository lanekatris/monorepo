#!/bin/bash

# Get the current date in YYYY-MM-DD format
current_date=$(date +"%Y%m%d_%H%M%S")
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Set the file name with the date prefix
filename="${SCRIPT_DIR}/../software/blog/src/content/notes/${current_date}.mdx"


# Check if the file already exists
if [ -f "$filename" ]; then
    echo "File '$filename' already exists. No new file created."
    exit 1
fi

# Create the markdown file with frontmatter
cat <<EOF > $filename
---
title: "xxx"
tags: []
---
import img from '../../assets/dead-sd.jpg'
import BestImage from '../../components/BestImage.astro'

EOF

# Notify the user
echo "Markdown file '$filename' has been created."
