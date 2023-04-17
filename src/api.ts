import { ipcRenderer } from 'electron';

let UserDataPath: string | null = null;

ipcRenderer.send('app', 'getUserDataPath');

ipcRenderer.on('app', (evt, messageObj) => {
  UserDataPath = messageObj;
});

export const API = () => ({
  UserDataPath,
  WindowAction: (action: string) => {
    ipcRenderer.send('window', action);
  },
  IsWindowMaximized: () => ipcRenderer.invoke('window', 'isMaximized'),
  DialogOpenDir: (title?: string) => ipcRenderer.invoke('dialog', { title, key: 'open-dir' }),
});
