#!/bin/bash

# Manual release script for Agent Zero Electron app
# This script helps create a release tag and trigger the build workflow

set -e

echo "🚀 Agent Zero Electron App Release Helper"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "electron" ]; then
    echo "❌ Please run this script from the Agent Zero root directory"
    exit 1
fi

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: v$CURRENT_VERSION"

# Ask for new version
echo ""
echo "Enter new version (e.g., 1.0.1, 1.1.0, 2.0.0):"
read -r NEW_VERSION

# Validate version format
if [[ ! $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "❌ Invalid version format. Use semantic versioning (e.g., 1.0.1)"
    exit 1
fi

# Update package.json version
echo "📝 Updating package.json version to $NEW_VERSION..."
npm version $NEW_VERSION --no-git-tag-version

# Create git tag
TAG_NAME="v$NEW_VERSION"
echo "🏷️  Creating git tag: $TAG_NAME"

# Commit version update
git add package.json package-lock.json
git commit -m "Bump version to $NEW_VERSION"

# Create and push tag
git tag $TAG_NAME
echo "📤 Pushing tag to trigger release build..."
git push origin $TAG_NAME

echo ""
echo "✅ Release process initiated!"
echo ""
echo "📋 What happens next:"
echo "   1. GitHub Actions will build binaries for all platforms"
echo "   2. A new release will be created at: https://github.com/K-Oz/a0/releases"
echo "   3. Distribution files will be uploaded to the release"
echo ""
echo "🔍 Monitor the build progress at:"
echo "   https://github.com/K-Oz/a0/actions"
echo ""
echo "📦 Release will include:"
echo "   • Agent-Zero-Linux.AppImage (Linux)"
echo "   • Agent-Zero-Linux.snap (Linux)" 
echo "   • Agent-Zero-Windows-Setup.exe (Windows)"
echo "   • Agent-Zero-macOS.dmg (macOS)"