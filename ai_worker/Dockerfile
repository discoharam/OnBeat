# Base Image with CUDA 12.1 (Compatible with Torch 2.1)
FROM pytorch/pytorch:2.1.2-cuda12.1-cudnn8-runtime

# Set working directory
WORKDIR /app

# Install System Dependencies (Audio libs)
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python Requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Application Code
COPY . .

# RunPod Command
CMD [ "python", "-u", "handler.py" ]
