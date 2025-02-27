#!/bin/bash

# Get the current date in YYYY-MM-DD format
current_date=$(date +"%Y-%m-%d")
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Set the file name with the date prefix
filename="${SCRIPT_DIR}/../software/blog/src/content/blog/${current_date}-xxxxxxxx.mdx"


# Check if the file already exists
if [ -f "$filename" ]; then
    echo "File '$filename' already exists. No new file created."
    exit 1
fi

# Create the markdown file with frontmatter
cat <<EOF > $filename
---
title: "xxxxxxxx"
pubDate: "${current_date}"
tags: []
---
import sevenpage26 from '../../assets/notebooks/FN07-page26-27.jpg'
import BestImage from '../../components/BestImage.astro'

# Your content starts here
EOF

echo "Waiting a second for compiling..."
sleep 1

xdg-open "http://localhost:4321/blog" 2>/dev/null

# Notify the user
echo "Markdown file '$filename' has been created."
