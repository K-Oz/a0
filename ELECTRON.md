# Agent Zero Desktop App

This repository includes an Electron-based desktop application wrapper for Agent Zero, allowing you to run the Agent Zero AI framework as a native desktop application.

## Downloads

### Pre-built Binaries

Download the latest release for your platform:

- **Linux**: 
  - AppImage: `Agent Zero-x.x.x.AppImage` (Universal, runs on most distributions)
  - Snap: `agent-zero_x.x.x_amd64.snap` (Ubuntu/Snap-compatible systems)
- **Windows**: `Agent-Zero-Windows-Setup.exe` (Installer)
- **macOS**: `Agent-Zero-macOS.dmg` (Disk image)

## Installation

### Linux

#### AppImage (Recommended)
1. Download the `.AppImage` file
2. Make it executable: `chmod +x Agent\ Zero-*.AppImage`
3. Run it: `./Agent\ Zero-*.AppImage`

#### Snap
1. Download the `.snap` file
2. Install: `sudo snap install --dangerous agent-zero_*.snap`
3. Run: `agent-zero`

### Windows
1. Download the `.exe` installer
2. Run the installer and follow the setup wizard
3. Launch from Start Menu or Desktop shortcut

### macOS
1. Download the `.dmg` file
2. Open the DMG and drag Agent Zero to Applications
3. Launch from Applications folder

## Requirements

The desktop app includes all necessary components, but requires:
- **Python 3.9 or later** (auto-detected)
- **Internet connection** for AI model APIs

## Features

### Desktop Integration
- Native desktop application with system menus
- Cross-platform support (Windows, macOS, Linux)
- Automatic Python server management
- Offline mode with helpful setup instructions

### Development Mode
If you're developing or want to run from source:

```bash
# Install dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Run in development mode
npm run electron-dev
```

## Building from Source

### Prerequisites
- Node.js 20+
- npm
- Python 3.9+

### Build Commands
```bash
# Install dependencies
npm install

# Build for your current platform
npm run build

# Build for specific platforms
npm run build-linux    # Linux (AppImage + Snap)
npm run build-win      # Windows (NSIS installer)
npm run build-mac      # macOS (DMG)

# Build for all platforms
npm run build-all
```

### Package Only (No Distribution)
```bash
npm run pack  # Creates unpacked app in dist/
```

## Release Process

Releases are automated via GitHub Actions when tags are pushed:

```bash
# Create and push a release tag
git tag v1.0.0
git push origin v1.0.0
```

This triggers the build workflow which:
1. Sets up cross-platform build environments (Ubuntu, Windows, macOS)
2. Installs dependencies with caching for faster builds
3. Builds binaries for all platforms (Linux AppImage/Snap, Windows NSIS, macOS DMG)
4. Creates a GitHub release with automated asset upload
5. Uploads the distribution files with proper naming

The workflow also supports manual triggering via the GitHub Actions UI for custom version releases.

### Workflow Validation

The repository includes automated validation of GitHub Actions workflow files to ensure syntax correctness and catch errors early. This validation runs automatically when workflow files are modified.

## Configuration

### Environment Variables
- `WEB_UI_PORT`: Port for the Flask server (default: 5000)
- `WEB_UI_HOST`: Host for the Flask server (default: localhost)

### Electron Settings
The app automatically:
- Finds available Python executable
- Starts Flask server on a free port
- Opens the web interface in Electron
- Shows offline mode if Python dependencies are missing

## Troubleshooting

### Python Not Found
The app will show an offline page with instructions to:
1. Install Python 3.9+
2. Install dependencies: `pip install -r requirements.txt`
3. Restart the app

### Build Issues
- Ensure all dependencies are installed
- Check that Python is in PATH
- For snap builds, ensure snapcraft is available

### Development Issues
- Use `npm run electron-dev` for development with debug output
- Check console logs for Python server startup messages
- Verify Flask dependencies are installed

## Architecture

The desktop app consists of:
- **Electron Main Process**: Manages the application lifecycle and Python server
- **Python Flask Server**: Runs the Agent Zero backend
- **Web UI**: The existing Agent Zero web interface
- **Offline Mode**: Fallback when Python is unavailable

The app automatically handles:
- Python executable detection
- Port management
- Server lifecycle
- Cross-platform compatibility