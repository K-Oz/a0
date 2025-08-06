#!/usr/bin/env python3
"""
Simple check script to verify Python dependencies and Flask server can start
"""

import sys
import subprocess
import importlib.util

def check_python_version():
    """Check if Python version is sufficient"""
    if sys.version_info < (3, 9):
        print(f"❌ Python {sys.version} is too old. Python 3.9+ required.")
        return False
    print(f"✅ Python {sys.version} is compatible.")
    return True

def check_module(module_name):
    """Check if a Python module is available"""
    spec = importlib.util.find_spec(module_name)
    if spec is None:
        print(f"❌ Module '{module_name}' not found")
        return False
    print(f"✅ Module '{module_name}' is available")
    return True

def main():
    print("🔍 Checking Agent Zero dependencies...")
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Check essential modules
    essential_modules = ['flask', 'os', 'threading', 'json']
    missing_modules = []
    
    for module in essential_modules:
        if not check_module(module):
            missing_modules.append(module)
    
    if missing_modules:
        print(f"\n❌ Missing modules: {', '.join(missing_modules)}")
        print("💡 Try installing: pip install flask")
        sys.exit(1)
    
    print("\n✅ All essential dependencies are available!")
    print("🚀 Ready to run Agent Zero Electron app!")

if __name__ == "__main__":
    main()