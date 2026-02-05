#!/bin/bash
# Run script that activates venv and runs main.py

set -e

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Running setup..."
    ./setup.sh
fi

# Activate virtual environment and run script
source venv/bin/activate
python main.py
