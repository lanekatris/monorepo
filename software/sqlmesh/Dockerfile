# Base image with Python 3.11
FROM python:3.11-slim

# Set working directory
WORKDIR /sqlmesh_project

# Install system dependencies (Postgres client, build tools)
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only the project requirements first for caching
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy SQLMesh project files
COPY . .

# Set default command (keep container alive for exec)
CMD ["sqlmesh", "run"]

