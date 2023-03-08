import { ipcRenderer } from 'electron'

let UserDataPath = '';

ipcRenderer.send('app', 'getUserDataPath');

ipcRenderer.on('app', function (evt, messageObj) {
  UserDataPath = messageObj;
});

export const API = () => ({
  UserDataPath
})
