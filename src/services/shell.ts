import { shell } from 'electron';

export function openExternalModelLink(id: number) {
  shell.openExternal(`https://civitai.com/models/${id}`).catch(() => {
    errorLog();
  });
}
export function openExternalUser(username: string) {
  shell.openExternal(`https://civitai.com/user/${username}`).catch(() => {
    errorLog();
  });
}

function errorLog() {
  console.error('Error opening an external link (Electron Shell API)');
}
