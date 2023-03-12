import { ipcRenderer } from 'electron'

let UserDataPath: string | null = null;

ipcRenderer.send('app', 'getUserDataPath');

ipcRenderer.on('app', function (evt, messageObj) {
  UserDataPath = messageObj;
});

export const API = () => ({
  UserDataPath,
  WindowAction: (action: string) => ipcRenderer.send('window', action),
  IsWindowMaximized: () => ipcRenderer.invoke('window', 'isMaximized')
})
