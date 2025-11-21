import { useState } from 'react';
import { useLogs } from './hooks/useLogs';
import LogViewer from './components/LogViewer';
import ControlPanel from './components/ControlPanel';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [url, setUrl] = useState('');
  const [flags, setFlags] = useState({
    detectCDN: false,
    captureJS: false,
    smartBackup: false,
    useOwnCDN: false
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const { logs, clearLogs, addLog } = useLogs();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleFlag = (flagName) => {
    setFlags((prev) => ({
      ...prev,
      [flagName]: !prev[flagName]
    }));
  };

  const handleDownload = async () => {
    if (!url) {
      addLog('error', 'Por favor ingresa una URL válida');
      return;
    }

    setIsDownloading(true);
    
    try {
      // Check if Electron API is available
      if (typeof window !== 'undefined' && window.electronAPI) {
        const result = await window.electronAPI.downloadSite(url, flags);
        
        if (!result.success) {
          addLog('error', `Error en descarga: ${result.error}`);
        }
      } else {
        // Fallback for web preview mode
        addLog('warning', 'Ejecutando en modo preview (sin Electron)');
        addLog('info', `URL: ${url}`);
        addLog('info', `Flags: ${JSON.stringify(flags, null, 2)}`);
        addLog('success', 'En modo Electron, aquí se realizaría la descarga real');
      }
    } catch (error) {
      addLog('error', `Error: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        await window.electronAPI.cleanupTemp();
      } else {
        addLog('info', 'Limpieza de archivos temporales (modo preview)');
      }
    } catch (error) {
      addLog('error', `Error en limpieza: ${error.message}`);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  ZiteBack
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  v4.0.0 - Sistema de Descarga Web Robusto
                </p>
              </div>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <ControlPanel
              url={url}
              setUrl={setUrl}
              flags={flags}
              toggleFlag={toggleFlag}
              isDownloading={isDownloading}
              onDownload={handleDownload}
              onCleanup={handleCleanup}
            />

            {/* Log Viewer */}
            <LogViewer
              logs={logs}
              onClear={clearLogs}
              isDarkMode={isDarkMode}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
