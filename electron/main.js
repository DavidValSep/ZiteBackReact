const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { downloadAndZip, cleanupTempFiles } = require('./core/downloader');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for download operations
ipcMain.handle('download-site', async (event, { url, flags }) => {
  try {
    // Send initial log
    event.sender.send('log-message', { 
      type: 'info', 
      message: `Iniciando descarga de ${url}...`,
      timestamp: new Date().toISOString()
    });

    const result = await downloadAndZip(url, flags, (log) => {
      // Send real-time logs to renderer
      event.sender.send('log-message', {
        type: log.type || 'info',
        message: log.message,
        timestamp: new Date().toISOString()
      });
    });

    event.sender.send('log-message', {
      type: 'success',
      message: `Descarga completada: ${result.outputPath}`,
      timestamp: new Date().toISOString()
    });

    return { success: true, result };
  } catch (error) {
    event.sender.send('log-message', {
      type: 'error',
      message: `Error: ${error.message}`,
      timestamp: new Date().toISOString()
    });
    return { success: false, error: error.message };
  }
});

ipcMain.handle('cleanup-temp', async (event) => {
  try {
    event.sender.send('log-message', {
      type: 'info',
      message: 'Limpiando archivos temporales...',
      timestamp: new Date().toISOString()
    });

    await cleanupTempFiles();

    event.sender.send('log-message', {
      type: 'success',
      message: 'Archivos temporales eliminados',
      timestamp: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    event.sender.send('log-message', {
      type: 'error',
      message: `Error al limpiar: ${error.message}`,
      timestamp: new Date().toISOString()
    });
    return { success: false, error: error.message };
  }
});
