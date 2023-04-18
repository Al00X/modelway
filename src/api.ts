import { ipcRenderer } from 'electron';

export class API {
  private static _userDataPath?: string;

  static async init() {
    this._userDataPath = await ipcRenderer.invoke('app', 'getUserDataPath');
  }

  static get userDataPath() {
    return this._userDataPath;
  }

  static doWindowAction(action: string) {
    ipcRenderer.send('window', action);
  }
  static isWindowMaximized() {
    return ipcRenderer.invoke('window', 'isMaximized');
  }
  static showDialogOpenDir(title?: string) {
    return ipcRenderer.invoke('dialog', { title, key: 'open-dir' });
  }
}
