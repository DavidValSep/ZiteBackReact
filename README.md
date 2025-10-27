# ZiteBack v4.0.0

🧑🏽‍💻 Sistema de descarga web robusto con interfaz gráfica moderna construida con **Electron + React + Tailwind CSS**.

## 🚀 Características

- **Interfaz Moderna**: GUI construida con React y Tailwind CSS
- **Arquitectura Separada**: Core Node.js completamente separado de la interfaz
- **Logs en Tiempo Real**: Sistema de logging dinámico con `useLogs` hook
- **Tema Claro/Oscuro**: Soporte completo para dark mode
- **Modular y Escalable**: Código preparado para migración a React Native
- **Flags Configurables**: 
  - Detectar CDN
  - Capturar JavaScript dinámico
  - Backup inteligente
  - Usar CDN propio

## 📁 Estructura del Proyecto

```
ZiteBackReact/
├── electron/                  # Core Node.js (separado de GUI)
│   ├── main.js               # Proceso principal de Electron
│   ├── preload.js            # Bridge seguro entre Node y Renderer
│   └── core/
│       └── downloader.js     # Lógica de descarga y ZIP
├── src/                      # React GUI
│   ├── App.jsx              # Componente principal con controles
│   ├── hooks/
│   │   └── useLogs.js       # Hook para logs en tiempo real
│   ├── components/
│   │   ├── ControlPanel.jsx # Panel de control con flags
│   │   └── LogViewer.jsx    # Visor de logs dinámico
│   ├── main.jsx             # Entry point de React
│   └── index.css            # Estilos con Tailwind
├── index.html               # HTML base
├── vite.config.js           # Configuración de Vite
├── tailwind.config.js       # Configuración de Tailwind
└── package.json             # Dependencias y scripts
```

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo (Vite + Electron)
npm run dev

# Construir aplicación
npm run build

# Construir ejecutable de Electron
npm run electron:build
```

## 🎨 Tecnologías

- **Electron** v28.0.0 - Framework de aplicaciones de escritorio
- **React** v18.2.0 - Librería UI
- **Vite** v5.0.8 - Build tool y dev server
- **Tailwind CSS** v3.4.0 - Framework CSS utility-first
- **Node.js** - Core para descargas y manejo de archivos

## 🔧 Arquitectura

### Separación GUI / Core

El proyecto mantiene una **separación estricta** entre la interfaz y la lógica:

- **GUI (React)**: Responsable solo de la presentación y experiencia de usuario
- **Core (Node.js)**: Maneja todas las operaciones de descarga, ZIP y limpieza

La comunicación se realiza mediante **IPC (Inter-Process Communication)** de Electron:

```javascript
// Desde React (renderer)
window.electronAPI.downloadSite(url, flags);

// Procesado en Node (main)
ipcMain.handle('download-site', async (event, { url, flags }) => {
  // Lógica de descarga
});
```

### Logs en Tiempo Real

El hook `useLogs` maneja logs dinámicos:

```javascript
const { logs, clearLogs, addLog } = useLogs();

// Los logs fluyen automáticamente desde el proceso principal
// a través de eventos IPC
```

## 📱 Preparado para React Native

El código está estructurado de forma modular para facilitar la migración a React Native:

- Componentes React puros sin dependencias de Electron en la UI
- Hooks reutilizables (`useLogs`)
- Lógica de negocio separada del rendering
- Estilos con Tailwind (compatible con NativeWind)

## 🔐 Seguridad

- **Context Isolation**: Activado para prevenir XSS
- **Node Integration**: Deshabilitado en renderer
- **Preload Script**: Bridge seguro para IPC

## 📝 Uso

1. Ingresa la URL del sitio web a descargar
2. Selecciona las opciones (flags) deseadas
3. Haz clic en "Descargar Sitio"
4. Observa los logs en tiempo real
5. Archivos ZIP se guardan en `/downloads`

## 🧹 Limpieza de Temporales

El sistema maneja automáticamente:
- Creación de directorios temporales
- Limpieza post-descarga
- Botón manual de limpieza

## 🎯 Próximos Pasos

- [ ] Implementar lógica completa de descarga web
- [ ] Agregar detección de CDN real
- [ ] Implementar captura de contenido JavaScript
- [ ] Sistema de backup inteligente con versionado
- [ ] CDN propio para recursos fallidos
- [ ] Tests unitarios e integración
- [ ] Versión móvil con React Native

## 📄 Licencia

MIT

---

Desarrollado con ❤️ para captura robusta de sitios web
