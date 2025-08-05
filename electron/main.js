const { app, BrowserWindow, shell, dialog, Menu } = require('electron');
const path = require('path');
const spawn = require('cross-spawn');
const findFreePort = require('find-free-port');

let mainWindow;
let pythonProcess;
let serverPort = 5000;

// Check if we're in development mode
const isDev = process.env.ELECTRON_ENV === 'development';

// Function to find Python executable
function findPython() {
  const possiblePaths = [
    'python',
    'python3',
    'python3.12',
    'python3.11',
    'python3.10',
    'python3.9',
    '/usr/bin/python3',
    '/usr/local/bin/python3'
  ];
  
  for (const pythonPath of possiblePaths) {
    try {
      const result = spawn.sync(pythonPath, ['--version'], { stdio: 'pipe' });
      if (result.status === 0) {
        return pythonPath;
      }
    } catch (error) {
      // Continue to next path
    }
  }
  
  return null;
}

// Function to start Python Flask server
async function startPythonServer() {
  return new Promise((resolve, reject) => {
    const python = findPython();
    if (!python) {
      reject(new Error('Python not found. Please install Python 3.9 or later.'));
      return;
    }

    // Find a free port
    findFreePort(5000, 5100, (err, freePort) => {
      if (err) {
        reject(err);
        return;
      }
      
      serverPort = freePort;
      
      // Set environment variables
      const env = {
        ...process.env,
        WEB_UI_PORT: serverPort.toString(),
        WEB_UI_HOST: 'localhost'
      };

      // Start Python server
      const scriptPath = isDev ? 'run_ui.py' : path.join(process.resourcesPath, 'run_ui.py');
      
      pythonProcess = spawn(python, [scriptPath], {
        env,
        cwd: isDev ? process.cwd() : process.resourcesPath,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      pythonProcess.stdout.on('data', (data) => {
        console.log(`Python stdout: ${data}`);
        // Look for server startup message
        if (data.toString().includes('Running on') || data.toString().includes('Serving Flask app')) {
          setTimeout(() => resolve(serverPort), 2000); // Give server time to fully start
        }
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
      });

      pythonProcess.on('close', (code) => {
        console.log(`Python process exited with code ${code}`);
      });

      pythonProcess.on('error', (error) => {
        console.error(`Failed to start Python process: ${error}`);
        reject(error);
      });

      // Fallback timeout
      setTimeout(() => {
        resolve(serverPort);
      }, 5000);
    });
  });
}

// Function to create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    show: false, // Don't show until ready
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default'
  });

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Chat',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.reload();
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Agent Zero',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Agent Zero',
              message: 'Agent Zero Desktop App',
              detail: 'A personal, organic agentic framework that grows and learns with you.'
            });
          }
        },
        {
          label: 'GitHub Repository',
          click: () => {
            shell.openExternal('https://github.com/frdel/agent-zero');
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event handlers
app.whenReady().then(async () => {
  // Create the Electron window first
  createWindow();
  
  try {
    // Start Python server
    console.log('Starting Python server...');
    await startPythonServer();
    console.log(`Python server started on port ${serverPort}`);
    
    // Load the web app
    const url = `http://localhost:${serverPort}`;
    console.log(`Loading URL: ${url}`);
    mainWindow.loadURL(url);
    
  } catch (error) {
    console.error('Failed to start Python server:', error);
    console.log('Loading offline mode...');
    
    // Load offline page if Python server fails
    const offlinePath = path.join(__dirname, 'offline.html');
    mainWindow.loadFile(offlinePath);
  }
});

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  // Kill Python process when app is quitting
  if (pythonProcess) {
    console.log('Terminating Python process...');
    pythonProcess.kill();
  }
});

// Handle process termination
process.on('exit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});

process.on('SIGINT', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
  app.quit();
});

process.on('SIGTERM', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
  app.quit();
});