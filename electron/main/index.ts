import { app, BrowserWindow, shell, ipcMain, protocol, dialog } from 'electron';
import { release } from 'node:os';
import { join } from 'node:path';
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../');
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist');
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, '../public') : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js');
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, 'index.html');

async function createWindow() {
  win = new BrowserWindow({
    title: 'ModelWay',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    frame: false,
    titleBarStyle: 'hidden',
    width: 1580,
    minWidth: 1190,
    height: 900,
    minHeight: 800,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298

    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url);
    return { action: 'deny' };
  });

  protocol.registerFileProtocol('asset', (request, callback) => {
    const file = request.url.substring(8, request.url.length);
    callback({ path: join(app.getPath('userData'), 'Data', 'assets', file) });
  });
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file://', ''));
    callback(pathname);
  });
}

app
  .whenReady()
  .then(async () => {
    // if (process.env.VITE_DEV_SERVER_URL) {
    //   await installExtension(REACT_DEVELOPER_TOOLS)
    //     .then((name) => console.log(`Added Extension:  ${name}`))
    //     .catch((err) => console.log('An error occurred: ', err));
    // }
  })
  .then(createWindow);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

// --------------------------------------------------------------------------------

ipcMain.handle('app', function (evt, messageObj) {
  if (messageObj === 'getUserDataPath') {
    return app.getPath('userData');
  }
});
ipcMain.on('window', (e, message) => {
  const window = BrowserWindow.getFocusedWindow();
  switch (message) {
    case 'close':
      window.close();
      break;
    case 'maximize':
      window.isMaximized() ? window.unmaximize() : window.maximize();
      break;
    case 'minimize':
      window.minimize();
      break;
  }
});
ipcMain.handle('window', (e, message) => {
  const window = BrowserWindow.getFocusedWindow();
  switch (message) {
    case 'isMaximized':
      return window.isMaximized();
  }
});
ipcMain.handle('dialog', async (e, message) => {
  if (message.key === 'open-dir') {
    return await dialog.showOpenDialog({ title: message.title, properties: ['openDirectory'] });
  }
});
