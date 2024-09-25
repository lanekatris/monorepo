#!/bin/bash

# Get the current date in YYYY-MM-DD format
current_date=$(date +"%Y-%m-%d")

# Set the file name with the date prefix
filename="/home/lane/git/monorepo/software/web/content/posts/${current_date}-xxxxxxxxxx.md"


# Check if the file already exists
if [ -f "$filename" ]; then
    echo "File '$filename' already exists. No new file created."
    exit 1
fi


# Create the markdown file with frontmatter
cat <<EOF > $filename
---
title: "xxxxxxxx"
description: ''
date: "${current_date}"
tags: []
draft: true
slug: ${current_date}-xxxxxxxx
---

# Your content starts here
EOF

echo "Waiting a second for compiling..."
sleep 1

xdg-open "http://localhost:3000/blog/${current_date}-xxxxxxxx" 2>/dev/null

# Notify the user
echo "Markdown file '$filename' has been created."
