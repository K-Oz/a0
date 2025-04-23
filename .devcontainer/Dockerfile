# Use the same base image as the official Agent Zero Docker image
FROM debian:bookworm-slim

# Setup the BRANCH environment variable for development
ARG BRANCH=main
ENV BRANCH=$BRANCH

# Install necessary packages (matching the official Agent Zero requirements)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    git \
    wget \
    curl \
    ffmpeg \
    openssh-server \
    sudo \
    procps

# Set up SSH for development access
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

# Set working directory to match Agent Zero's container structure
WORKDIR /a0

# Create directories that match the official Agent Zero structure
RUN mkdir -p /a0/work_dir /a0/tmp

# Copy .bashrc and .profile for root user to ensure Python venv is loaded
RUN echo 'source /opt/venv/bin/activate' >> /root/.bashrc && \
    echo 'source /opt/venv/bin/activate' >> /root/.profile

# Expose ports - 80 for web UI, 22 for SSH access
EXPOSE 22 80

# Set default shell to bash
SHELL ["/bin/bash", "-c"]

# Start SSH server and keep container running
CMD service ssh start && sleep infinity
