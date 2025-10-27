import { useState, useEffect } from 'react';

/**
 * Custom hook to manage real-time logs
 * Handles log messages from the Electron main process
 */
export function useLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Check if we're running in Electron
    if (typeof window !== 'undefined' && window.electronAPI) {
      // Set up log listener
      window.electronAPI.onLogMessage((log) => {
        setLogs((prevLogs) => [
          ...prevLogs,
          {
            id: `${Date.now()}-${Math.random()}`,
            ...log
          }
        ]);
      });

      // Cleanup listener on unmount
      return () => {
        window.electronAPI.removeLogListener();
      };
    }
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const addLog = (type, message) => {
    setLogs((prevLogs) => [
      ...prevLogs,
      {
        id: `${Date.now()}-${Math.random()}`,
        type,
        message,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return {
    logs,
    clearLogs,
    addLog
  };
}
