# Development Guide for Agent Zero Desktop App

This guide covers development, building, and contributing to the Agent Zero Electron desktop application.

## Quick Setup

```bash
# 1. Install Node.js dependencies
npm install

# 2. Install Python dependencies (for development)
pip install flask flask-basicauth python-dotenv

# 3. Validate build system
./scripts/validate-build.sh

# 4. Run in development mode
npm run electron-dev
```

## Project Structure

```
electron/
├── main.js           # Electron main process
├── offline.html      # Fallback page when Python fails
├── check-deps.py     # Python dependency checker
└── assets/           # App icons (placeholder)

scripts/
├── validate-build.sh # Build system validation
└── create-release.sh # Release helper script

.github/workflows/
└── build-release.yml # CI/CD pipeline for releases
```

## Development Workflow

### 1. Running Locally

```bash
# Development mode with debug output
npm run electron-dev

# Package without distribution (faster testing)
npm run pack

# Build for current platform
npm run build
```

### 2. Testing Changes

```bash
# Validate build system works
./scripts/validate-build.sh

# Test packaging
npm run pack
ls -la dist/linux-unpacked/
```

### 3. Cross-Platform Building

```bash
# Build for specific platforms
npm run build-linux    # AppImage + Snap
npm run build-win      # NSIS installer  
npm run build-mac      # DMG package

# Build for all platforms (requires platform-specific tools)
npm run build-all
```

## Architecture

### Electron Main Process (`electron/main.js`)

The main process handles:
- **Python Detection**: Automatically finds Python executable
- **Flask Server**: Starts the Agent Zero backend on a free port
- **Window Management**: Creates and manages the Electron browser window
- **Fallback Mode**: Shows offline page if Python is unavailable
- **Cross-Platform**: Handles platform-specific differences

### Build Configuration (`package.json`)

The build configuration:
- **File Inclusion**: Packages Python code, webui, and resources
- **Platform Targets**: AppImage/Snap (Linux), NSIS (Windows), DMG (macOS)
- **Resource Handling**: Includes Python files as extra resources
- **Auto-Update**: Configured for future auto-update support

### CI/CD Pipeline (`.github/workflows/build-release.yml`)

The pipeline:
- **Multi-Platform**: Builds on Ubuntu, Windows, and macOS runners
- **Dependency Management**: Installs Python and Node.js dependencies
- **Artifact Storage**: Uploads platform-specific binaries
- **Release Creation**: Automatically creates GitHub releases on tags

## Common Development Tasks

### Adding New Features

1. **Electron Features**: Modify `electron/main.js`
2. **Python Backend**: Modify existing Agent Zero Python code
3. **UI Changes**: Modify files in `webui/` directory
4. **Build Changes**: Update `package.json` build configuration

### Debugging

```bash
# Enable debug output
ELECTRON_ENV=development npm run electron-dev

# Check Python server logs
# (logs appear in Electron console)

# Test offline mode
# (remove Python or rename run_ui.py temporarily)
```

### Platform-Specific Notes

#### Linux
- AppImage: Universal, runs on most distributions
- Snap: Ubuntu and Snap-compatible systems
- Icons: PNG format recommended

#### Windows  
- NSIS: Creates traditional Windows installer
- Code signing: Disabled by default (can be enabled)
- Icons: ICO format required

#### macOS
- DMG: Standard macOS distribution format
- Code signing: Disabled by default (can be enabled)
- Icons: ICNS format required
- Notarization: Required for distribution outside App Store

## Release Process

### Automated (Recommended)

```bash
# Create and push a release tag
./scripts/create-release.sh
```

### Manual

```bash
# 1. Update version
npm version 1.0.1 --no-git-tag-version

# 2. Commit and tag
git add package.json package-lock.json
git commit -m "Bump version to 1.0.1"
git tag v1.0.1

# 3. Push tag to trigger build
git push origin v1.0.1
```

## Troubleshooting

### Build Issues

```bash
# Clear build cache
rm -rf dist/ node_modules/
npm install

# Validate dependencies
./scripts/validate-build.sh

# Check Electron Builder logs
npm run build 2>&1 | tee build.log
```

### Runtime Issues

```bash
# Test Python detection
python3 electron/check-deps.py

# Test Flask server manually
python3 run_ui.py

# Check Electron console
# Open Developer Tools in the Electron app
```

### Platform-Specific Issues

- **Linux**: Ensure AppStream data is valid
- **Windows**: Check NSIS configuration
- **macOS**: Verify DMG creation and mounting

## Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Test** changes with `./scripts/validate-build.sh`
4. **Submit** a pull request

### Code Style

- **JavaScript**: Follow existing code style in `electron/main.js`
- **Python**: Follow PEP 8 for any Python additions
- **Configuration**: Keep build config minimal and well-commented

### Testing

- Test on multiple platforms if possible
- Verify both online and offline modes work
- Check that all required resources are packaged
- Test the build and installation process

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Agent Zero Documentation](./README.md)