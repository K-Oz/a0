# Use the latest slim version of Debian
FROM debian:bookworm-slim

# Setup the BRANCH environment variable for development
ENV BRANCH=main

# Install necessary packages
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
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

# Create a non-root user for development
RUN useradd -m -s /bin/bash -G sudo vscode && \
    echo "vscode:vscode" | chpasswd && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Create and activate Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy requirements from the host
WORKDIR /workspaces/a0

# Expose ports
EXPOSE 22 80

# Set default shell to bash
SHELL ["/bin/bash", "-c"]

# Start the development environment
CMD ["sleep", "infinity"]
