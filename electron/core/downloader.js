const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

/**
 * Main download and ZIP function
 * This is the core Node.js logic separated from the GUI
 */
async function downloadAndZip(url, flags, logCallback) {
  const tempDir = path.join(__dirname, '../../tmp', `download-${Date.now()}`);
  const outputDir = path.join(__dirname, '../../downloads');

  try {
    // Create directories
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    logCallback({ type: 'info', message: `Creando directorio temporal: ${tempDir}` });

    // Parse flags
    const options = parseFlags(flags);
    
    logCallback({ type: 'info', message: `Opciones de descarga: ${JSON.stringify(options)}` });

    // Simulate download process (replace with actual implementation)
    logCallback({ type: 'info', message: 'Iniciando proceso de descarga...' });
    
    // Here you would implement the actual download logic
    // For now, we'll create a placeholder
    await simulateDownload(url, tempDir, options, logCallback);

    // Create ZIP file
    const zipName = `${sanitizeFilename(url)}-${Date.now()}.zip`;
    const zipPath = path.join(outputDir, zipName);
    
    logCallback({ type: 'info', message: 'Creando archivo ZIP...' });
    await createZip(tempDir, zipPath, logCallback);

    logCallback({ type: 'success', message: 'Descarga y compresión completadas' });

    return {
      outputPath: zipPath,
      size: (await fs.stat(zipPath)).size
    };
  } catch (error) {
    logCallback({ type: 'error', message: error.message });
    throw error;
  } finally {
    // Cleanup temp directory
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
      logCallback({ type: 'info', message: 'Directorio temporal limpiado' });
    } catch (cleanupError) {
      logCallback({ type: 'warning', message: `Error al limpiar: ${cleanupError.message}` });
    }
  }
}

/**
 * Parse download flags
 */
function parseFlags(flags) {
  return {
    detectCDN: flags.detectCDN || false,
    captureJS: flags.captureJS || false,
    smartBackup: flags.smartBackup || false,
    useOwnCDN: flags.useOwnCDN || false
  };
}

/**
 * Simulate download (placeholder for actual implementation)
 */
async function simulateDownload(url, targetDir, options, logCallback) {
  // This is a placeholder - implement actual download logic here
  logCallback({ type: 'info', message: `Descargando contenido de ${url}...` });
  
  // Create a sample file to demonstrate functionality
  const indexPath = path.join(targetDir, 'index.html');
  const escapedUrl = escapeHtml(url);
  await fs.writeFile(indexPath, `<!DOCTYPE html>
<html>
<head>
  <title>Downloaded from ${escapedUrl}</title>
</head>
<body>
  <h1>Site downloaded successfully</h1>
  <p>URL: ${escapedUrl}</p>
  <p>Options: ${escapeHtml(JSON.stringify(options))}</p>
</body>
</html>`);

  logCallback({ type: 'success', message: 'Contenido descargado' });
}

/**
 * Create ZIP file from directory
 */
async function createZip(sourceDir, outputPath, logCallback) {
  try {
    // Using native zip command with proper escaping
    const isWindows = process.platform === 'win32';
    
    // Escape paths to prevent command injection
    const escapedSourceDir = sourceDir.replace(/"/g, '\\"');
    const escapedOutputPath = outputPath.replace(/"/g, '\\"');
    
    let command;

    if (isWindows) {
      // PowerShell compress for Windows
      command = `powershell Compress-Archive -Path "${escapedSourceDir}\\*" -DestinationPath "${escapedOutputPath}"`;
    } else {
      // Unix zip command
      command = `cd "${escapedSourceDir}" && zip -r "${escapedOutputPath}" .`;
    }

    await execAsync(command);
    logCallback({ type: 'success', message: 'ZIP creado exitosamente' });
  } catch (error) {
    throw new Error(`Error creando ZIP: ${error.message}`);
  }
}

/**
 * Cleanup all temporary files
 */
async function cleanupTempFiles() {
  const tempDir = path.join(__dirname, '../../tmp');
  
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
    await fs.mkdir(tempDir, { recursive: true });
  } catch (error) {
    throw new Error(`Error limpiando archivos temporales: ${error.message}`);
  }
}

/**
 * Sanitize filename
 */
function sanitizeFilename(url) {
  return url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .substring(0, 50);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

module.exports = {
  downloadAndZip,
  cleanupTempFiles
};
