import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Disable GPU for better transparency support
app.disableHardwareAcceleration()

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: true, // Visible for editing, hide with Ctrl+Shift+T for OBS
    resizable: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  })

  // Set background transparent
  mainWindow.setBackgroundColor('#00000000')

  // Hide from screen capture (OBS, screenshots, etc.)
  // Platform-specific content protection
  if (process.platform === 'win32') {
    // Windows: Use SetWindowDisplayAffinity (WDA_EXCLUDEFROMCAPTURE)
    // Requires Electron 34.3.0 for proper functionality
    mainWindow.setContentProtection(true)
  } else if (process.platform === 'darwin') {
    // macOS: Use CGWindowSetSharingType(kCGWindowSharingNone)
    mainWindow.setContentProtection(true)
  }
  // Linux: No native API available for OBS capture exclusion
  // Use Chroma Key filter in OBS as fallback (see OBS_SETUP_GUIDE below)

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    // Don't open devtools automatically
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  // Enable F12 to open DevTools
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.key === 'F12' && input.metaKey) || (input.key === 'F12' && input.controlKey)) {
      event.preventDefault()
      if (mainWindow?.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools()
      } else {
        mainWindow?.webContents.openDevTools()
      }
    }
  })

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Log any errors
  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription)
  })

  // Log renderer process crashes
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('Renderer process gone:', details.reason)
  })
}

// IPC handlers
ipcMain.handle('window:minimize', () => {
  try {
    mainWindow?.minimize()
  } catch (error) {
    console.error('Error minimizing window:', error)
  }
})

ipcMain.handle('window:maximize', () => {
  try {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  } catch (error) {
    console.error('Error maximizing window:', error)
  }
})

ipcMain.handle('window:close', () => {
  try {
    mainWindow?.close()
  } catch (error) {
    console.error('Error closing window:', error)
  }
})

ipcMain.handle('window:setAlwaysOnTop', (_event, flag: boolean) => {
  try {
    mainWindow?.setAlwaysOnTop(flag)
  } catch (error) {
    console.error('Error setting always on top:', error)
  }
})

ipcMain.handle('window:setOpacity', (_event, opacity: number) => {
  try {
    // Validate opacity value
    const validOpacity = Math.max(0, Math.min(1, opacity))
    mainWindow?.setOpacity(validOpacity)
  } catch (error) {
    console.error('Error setting opacity:', error)
  }
})

// Show/hide window handlers
ipcMain.handle('window:show', () => {
  try {
    mainWindow?.show()
    mainWindow?.focus()
  } catch (error) {
    console.error('Error showing window:', error)
  }
})

ipcMain.handle('window:hide', () => {
  try {
    mainWindow?.hide()
  } catch (error) {
    console.error('Error hiding window:', error)
  }
})

// Toggle content protection (hide from OBS/screen capture)
ipcMain.handle('window:setCaptureProtection', (_event, enabled: boolean) => {
  try {
    if (mainWindow && process.platform === 'win32') {
      mainWindow.setContentProtection(enabled)
    }
  } catch (error) {
    console.error('Error setting capture protection:', error)
  }
})

// App lifecycle
app.whenReady().then(() => {
  createWindow()

  // Global shortcut to toggle window visibility (Ctrl+Shift+T)
  globalShortcut.register('CommandOrControl+Shift+T', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })

  // Also show window when app starts (user needs to press Ctrl+Shift+T to see it)
  // For now, let's keep it hidden until user presses the shortcut

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason)
})

/**
 * OBS Setup Guide - Cross-Platform Capture Protection
 * ====================================================
 *
 * WINDOWS 10/11:
 * - setContentProtection(true) works automatically with Electron 34.3.0
 * - Window will be invisible to OBS screen capture
 *
 * macOS:
 * - setContentProtection(true) works automatically
 * - Window will be invisible to OBS screen capture
 *
 * LINUX UBUNTU 22.04 LTS:
 * - No native API available (Wayland/X11 limitation)
 * - Use Chroma Key filter in OBS as fallback:
 *
 *   OBS Setup for Linux:
 *   1. Add Window Capture source
 *   2. Right-click on the source → Filters
 *   3. Click "+" → Add "Chroma Key" filter
 *   4. Configure:
 *      - Key Color Type: Green
 *      - Similarity: 400
 *      - Smoothness: 80
 *   5. Alternative: Use "Color Key" filter with a solid background color
 *
 *   For teleprompter transparency in OBS on Linux:
 *   - Use a green screen background in the teleprompter
 *   - Apply Chroma Key filter in OBS to remove green
 */