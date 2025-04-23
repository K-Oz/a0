# Use the latest slim version of Debian
FROM debian:bookworm-slim

# Install necessary packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-venv \
    nodejs \
    npm \
    openssh-server \
    sudo \
    curl \
    wget \
    git \
    ffmpeg

# Set up SSH
RUN mkdir -p /var/run/sshd && \
    echo 'root:toor' | chpasswd && \
    sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# Create and activate Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Expose ports
EXPOSE 22 80
