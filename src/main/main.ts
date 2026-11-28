/**
 * EXCO Main Process Entry Point
 * Electron main process with security hardening and lifecycle management
 */

import * as path from 'path';
import moduleAlias from 'module-alias';

// Configure runtime aliases for compiled JavaScript
(moduleAlias as any).addAliases({
  '@main': __dirname,
  '@shared': path.join(__dirname, '../shared'),
});

import { app, BrowserWindow, ipcMain, dialog, shell, Menu, nativeTheme, session, nativeImage } from 'electron';
import * as fs from 'fs';
import { autoUpdater } from 'electron-updater';
import { initializeDatabase, closeDatabase, getDatabase, getProviders } from '@main/database';
import { initializeVault, getVaultStatus } from '@main/services/credential-vault';
import { providerManager } from '@main/services/ai-providers';
import { registerAllIpcHandlers } from '@main/ipc/handlers';
import {
  WINDOW_DEFAULTS,
  WINDOW_TITLE,
  APP_NAME,
  DB_NAME,
  getDbPath,
  TIMEOUTS,
} from '@shared/constants';
import { isDevelopment, isWindows, isMac } from '@shared/utils';

// ============================================================================
// Global References
// ============================================================================

declare global {
  var mainWindow: BrowserWindow | null;
  var isQuitting: boolean;
}

global.mainWindow = null;
global.isQuitting = false;

// ============================================================================
// Security: Prevent Navigation
// ============================================================================

function preventNavigation(window: BrowserWindow): void {
  window.webContents.on('will-navigate', (event, url) => {
    try {
      const parsedUrl = new URL(url);
      const isAppOrigin = isDevelopment()
        ? (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') &&
          (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1')
        : parsedUrl.protocol === 'file:';

      if (isAppOrigin) {
        return;
      }

      // Open all model/user external links in the OS default browser rather than inside EXCO
      event.preventDefault();
      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        shell.openExternal(url);
      }
    } catch {
      event.preventDefault();
    }
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
        shell.openExternal(url);
      }
    } catch {
      // Ignore malformed external URLs
    }
    return { action: 'deny' };
  });

  // Disable remote module
  window.webContents.on('dom-ready', () => {
    window.webContents.executeJavaScript(`
      delete require;
      delete module;
      delete process;
    `).catch(() => {});
  });
}

// ============================================================================
// Window Management
// ============================================================================

function createMainWindow(): BrowserWindow {
  const preloadPath = path.join(__dirname, '../preload/preload.js');
  const pngCandidates = [
    path.join(__dirname, '../../build-resources/icon.png'),
    path.join(__dirname, '../renderer/assets/icon.png'),
    path.join(process.resourcesPath || '', 'icon.png'),
  ];
  const icoCandidates = [
    path.join(__dirname, '../../build-resources/icon.ico'),
    path.join(process.resourcesPath || '', 'icon.ico'),
  ];
  const pngIconPath = pngCandidates.find(p => p && fs.existsSync(p));
  const icoIconPath = icoCandidates.find(p => p && fs.existsSync(p));
  const nativeWinIcon = pngIconPath ? nativeImage.createFromPath(pngIconPath) : undefined;
  const effectiveWindowIcon =
    nativeWinIcon && !nativeWinIcon.isEmpty() ? nativeWinIcon : icoIconPath || pngIconPath;

  const window = new BrowserWindow({
    ...WINDOW_DEFAULTS,
    icon: effectiveWindowIcon,
    title: WINDOW_TITLE,
    webPreferences: {
      ...WINDOW_DEFAULTS.webPreferences,
      preload: preloadPath,
    },
    show: false, // Show after ready to prevent flash
  });

  if (isWindows()) {
    if (effectiveWindowIcon && typeof effectiveWindowIcon !== 'string') {
      window.setIcon(effectiveWindowIcon);
    }
    if (icoIconPath) {
      try {
        window.setAppDetails({
          appId: 'com.exco.app',
          appIconPath: icoIconPath,
          appIconIndex: 0,
          relaunchDisplayName: 'EXCO',
        });
      } catch {}
    }
  }

  // Security hardening
  preventNavigation(window);

  // Load URL based on environment
  if (isDevelopment()) {
    window.loadURL('http://localhost:5173');
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    const rendererPath = path.join(__dirname, '../renderer/index.html');
    window.loadFile(rendererPath);
  }

  window.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription, validatedURL);
    dialog.showErrorBox('Page Load Error', `Failed to load ${validatedURL}\nError: ${errorDescription} (${errorCode})`);
  });

  // Show window when ready
  window.once('ready-to-show', () => {
    window.show();
    window.focus();
  });

  // Fallback in case ready-to-show is delayed
  setTimeout(() => {
    if (window && !window.isDestroyed() && !window.isVisible()) {
      window.show();
      window.focus();
    }
  }, 1500);

  // Handle window close
  window.on('close', (event) => {
    if (!global.isQuitting && process.platform === 'darwin') {
      event.preventDefault();
      window.hide();
    }
  });

  window.on('closed', () => {
    global.mainWindow = null;
  });

  // Handle renderer process crashes
  window.webContents.on('render-process-gone', (event, details) => {
    console.error('Renderer process gone:', details.reason);
    if (!global.isQuitting) {
      dialog.showErrorBox(
        'Renderer Process Crashed',
        `The application encountered an error and needs to restart.\nReason: ${details.reason}`
      );
      app.relaunch();
      app.exit(0);
    }
  });

  // Handle unresponsive renderer
  window.webContents.on('unresponsive', () => {
    dialog.showMessageBox(window, {
      type: 'warning',
      title: 'Application Unresponsive',
      message: 'The application has become unresponsive.',
      detail: 'Would you like to wait for it to recover or force close?',
      buttons: ['Wait', 'Force Close'],
      defaultId: 0,
      cancelId: 1,
    }).then(({ response }) => {
      if (response === 1) {
        window.destroy();
      }
    });
  });

  return window;
}

// ============================================================================
// Application Menu
// ============================================================================

function createApplicationMenu(): Menu {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: APP_NAME,
      submenu: [
        { role: 'about', label: `About ${APP_NAME}` },
        { type: 'separator' },
        { role: 'services', label: 'Services' },
        { type: 'separator' },
        { role: 'hide', label: `Hide ${APP_NAME}` },
        { role: 'hideOthers', label: 'Hide Others' },
        { role: 'unhide', label: 'Show All' },
        { type: 'separator' },
        { role: 'quit', label: `Quit ${APP_NAME}` },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { role: 'selectAll', label: 'Select All' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { role: 'forceReload', label: 'Force Reload' },
        { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Reset Zoom' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Fullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize', label: 'Minimize' },
        { role: 'zoom', label: 'Zoom' },
        ...(isMac() ? [{ type: 'separator' as const }, { role: 'front' as const, label: 'Bring All to Front' }] : []),
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => shell.openExternal('https://github.com/Bishnucd/EXCO'),
        },
        {
          label: 'Report Issue',
          click: () => shell.openExternal('https://github.com/Bishnucd/EXCO/issues'),
        },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => {
            if (!isDevelopment()) {
              emitUpdateStatus({ status: 'checking', error: undefined });
              autoUpdater.checkForUpdates().catch(() => {});
            }
          },
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
}

// ============================================================================
// IPC Setup
// ============================================================================

function setupIpc(): void {
  // Register all handlers
  registerAllIpcHandlers();

  // Handle synchronous IPC if needed (avoid where possible)
  ipcMain.on('app:ping', (event) => {
    event.returnValue = 'pong';
  });
}

// ============================================================================
// Auto Updater (Background download + manual user restart)
// ============================================================================

interface AppUpdateState {
  status: 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'up-to-date' | 'error';
  currentVersion: string;
  availableVersion?: string;
  progress?: number;
  error?: string;
}

let updateState: AppUpdateState = {
  status: 'idle',
  currentVersion: '0.1.0',
};

function emitUpdateStatus(patch: Partial<AppUpdateState>): void {
  updateState = { ...updateState, ...patch, currentVersion: app.getVersion() };
  if (global.mainWindow && !global.mainWindow.isDestroyed()) {
    global.mainWindow.webContents.send('updater:status', updateState);
  }
}

function setupAutoUpdater(): void {
  updateState.currentVersion = app.getVersion();

  ipcMain.handle('updater:get-status', () => {
    return { ...updateState, currentVersion: app.getVersion() };
  });

  ipcMain.handle('updater:check', async () => {
    if (isDevelopment()) {
      emitUpdateStatus({ status: 'up-to-date', error: undefined });
      return updateState;
    }
    try {
      emitUpdateStatus({ status: 'checking', error: undefined });
      await autoUpdater.checkForUpdates();
    } catch (err) {
      emitUpdateStatus({
        status: 'error',
        error: err instanceof Error ? err.message : 'Update check failed',
      });
    }
    return updateState;
  });

  ipcMain.handle('updater:install', () => {
    if (updateState.status === 'downloaded') {
      global.isQuitting = true;
      setImmediate(() => {
        autoUpdater.quitAndInstall(false, true);
      });
      return true;
    }
    return false;
  });

  if (isDevelopment()) return;

  // Download updates automatically in the background, but NEVER auto-restart until user clicks Restart
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on('checking-for-update', () => {
    emitUpdateStatus({ status: 'checking', error: undefined });
  });

  autoUpdater.on('update-available', (info) => {
    emitUpdateStatus({
      status: 'available',
      availableVersion: info?.version,
      progress: 0,
      error: undefined,
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    emitUpdateStatus({
      status: 'downloading',
      progress: Math.round(progressObj?.percent || 0),
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    emitUpdateStatus({
      status: 'downloaded',
      availableVersion: info?.version,
      progress: 100,
      error: undefined,
    });
  });

  autoUpdater.on('update-not-available', () => {
    if (updateState.status !== 'downloaded') {
      emitUpdateStatus({ status: 'up-to-date', error: undefined });
    }
  });

  autoUpdater.on('error', (error) => {
    console.error('Auto-updater error:', error);
    if (updateState.status !== 'downloaded') {
      emitUpdateStatus({
        status: 'error',
        error: error instanceof Error ? error.message : 'Update error',
      });
    }
  });

  // Initial check shortly after startup + background poll every 30 minutes
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {});
  }, 4000);
  setInterval(() => {
    if (updateState.status !== 'downloaded') {
      autoUpdater.checkForUpdates().catch(() => {});
    }
  }, 30 * 60 * 1000);
}

// ============================================================================
// Application Lifecycle
// ============================================================================

async function initializeApp(): Promise<void> {
  // Set app user model ID for Windows
  if (isWindows()) {
    app.setAppUserModelId('com.exco.app');
  }

  // Get app data path
  const appDataPath = app.getPath('userData');

  // Initialize database
  await initializeDatabase(appDataPath);

  // Initialize AI providers
  try {
    const providers = getProviders();
    await providerManager.initializeProviders(providers);
  } catch (err) {
    console.warn('Failed to initialize AI providers:', err);
  }

  // Initialize credential vault
  await initializeVault();

  // Check vault status
  const vaultStatus = await getVaultStatus();
  console.log('Credential vault status:', vaultStatus);

  // Setup permission handlers for microphone voice input
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    return permission === 'media' || permission === 'clipboard-read';
  });
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'media' || permission === 'clipboard-read');
  });

  // Setup IPC
  setupIpc();

  // Setup auto-updater
  setupAutoUpdater();

  // Create menu
  Menu.setApplicationMenu(createApplicationMenu());

  // Create main window
  global.mainWindow = createMainWindow();
}

function setupAppEvents(): void {
  // Single instance lock
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
    return;
  }

  app.on('second-instance', () => {
    if (global.mainWindow) {
      if (global.mainWindow.isMinimized()) global.mainWindow.restore();
      global.mainWindow.focus();
    }
  });

  // Window all closed
  app.on('window-all-closed', () => {
    if (!isMac()) {
      app.quit();
    }
  });

  // Activate (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      global.mainWindow = createMainWindow();
    }
  });

  // Before quit
  app.on('before-quit', () => {
    global.isQuitting = true;
    closeDatabase();
  });

  // Will quit
  app.on('will-quit', () => {
    // Cleanup handled in before-quit
  });

  // Certificate errors (for development)
  app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    if (isDevelopment()) {
      event.preventDefault();
      callback(true);
    } else {
      callback(false);
    }
  });
}

// Windows OneDrive/AppContainer environments can crash Electron's GPU/renderer sandbox on direct launch
if (isWindows()) {
  app.commandLine.appendSwitch('no-sandbox');
}

// ============================================================================
// Main Entry Point
// ============================================================================

app.whenReady().then(async () => {
  try {
    await initializeApp();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    dialog.showErrorBox('Initialization Failed', `Failed to start EXCO:\n${error instanceof Error ? error.message : 'Unknown error'}`);
    app.quit();
  }
});

setupAppEvents();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  if (global.mainWindow && !global.mainWindow.isDestroyed()) {
    dialog.showErrorBox('Unexpected Error', `An unexpected error occurred:\n${error.message}`);
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

// Export for testing
export { createMainWindow, initializeApp };