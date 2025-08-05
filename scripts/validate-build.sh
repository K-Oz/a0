#!/bin/bash

# Build validation script for Agent Zero Electron app
# This script validates that the build system is working correctly

set -e

echo "🔍 Validating Agent Zero Electron build system..."

# Check Node.js and npm
echo "📦 Checking Node.js..."
node --version || { echo "❌ Node.js not found"; exit 1; }
npm --version || { echo "❌ npm not found"; exit 1; }

# Check Python
echo "🐍 Checking Python..."
python3 --version || python --version || { echo "❌ Python not found"; exit 1; }

# Install npm dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing npm dependencies..."
    npm install
fi

# Validate package.json structure
echo "🔧 Validating package.json..."
node -e "
const pkg = require('./package.json');
if (!pkg.main || !pkg.build || !pkg.scripts.build) {
    console.error('❌ Invalid package.json structure');
    process.exit(1);
}
console.log('✅ package.json is valid');
"

# Test packaging (without full distribution)
echo "📦 Testing Electron packaging..."
npm run pack

# Verify packaged app structure
if [ -d "dist/linux-unpacked" ]; then
    echo "✅ Electron app packaged successfully"
    
    # Check if app files are included
    if [ -f "dist/linux-unpacked/resources/app.asar" ]; then
        echo "✅ App resources packaged correctly"
    else
        echo "❌ App resources missing"
        exit 1
    fi
    
    # Check if Python resources are included
    if [ -d "dist/linux-unpacked/resources/python" ]; then
        echo "✅ Python resources included"
    else
        echo "❌ Python resources missing"
        exit 1
    fi
else
    echo "❌ Packaging failed"
    exit 1
fi

# Clean up test artifacts
echo "🧹 Cleaning up..."
rm -rf dist/

echo "🎉 Build validation completed successfully!"
echo ""
echo "📋 Summary:"
echo "   ✅ Node.js and npm are available"
echo "   ✅ Python is available"
echo "   ✅ package.json is valid"
echo "   ✅ Electron packaging works"
echo "   ✅ App and Python resources are included"
echo ""
echo "🚀 Ready to build Agent Zero Electron app!"
echo ""
echo "Build commands:"
echo "   npm run build-linux  # Linux (AppImage + Snap)"
echo "   npm run build-win    # Windows (NSIS installer)"
echo "   npm run build-mac    # macOS (DMG)"
echo "   npm run build-all    # All platforms"