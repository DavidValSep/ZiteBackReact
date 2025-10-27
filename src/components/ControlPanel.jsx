import React from 'react';

function ControlPanel({ url, setUrl, flags, toggleFlag, isDownloading, onDownload, onCleanup }) {
  const flagsConfig = [
    {
      key: 'detectCDN',
      label: 'Detectar CDN',
      description: 'Detecta y maneja recursos de CDN automáticamente'
    },
    {
      key: 'captureJS',
      label: 'Capturar JS',
      description: 'Captura y ejecuta JavaScript para contenido dinámico'
    },
    {
      key: 'smartBackup',
      label: 'Backup Inteligente',
      description: 'Crea respaldos inteligentes con versionado'
    },
    {
      key: 'useOwnCDN',
      label: 'Usar CDN Propio',
      description: 'Utiliza CDN propio cuando los recursos no están disponibles'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Panel de Control
      </h2>

      {/* URL Input */}
      <div className="mb-6">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          URL del Sitio Web
        </label>
        <input
          id="url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://ejemplo.com"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
          disabled={isDownloading}
        />
      </div>

      {/* Flags */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Opciones de Descarga
        </h3>
        <div className="space-y-3">
          {flagsConfig.map((flag) => (
            <div key={flag.key} className="flex items-start">
              <input
                id={flag.key}
                type="checkbox"
                checked={flags[flag.key]}
                onChange={() => toggleFlag(flag.key)}
                disabled={isDownloading}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <label htmlFor={flag.key} className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                  {flag.label}
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {flag.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Descargando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Descargar Sitio
            </>
          )}
        </button>

        <button
          onClick={onCleanup}
          disabled={isDownloading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpiar
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
