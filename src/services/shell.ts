import { shell } from 'electron';

export function openExternalModelLink(id: number) {
  shell.openExternal(`https://civitai.com/models/${id}`).catch((e) => {
    errorLog(e);
  });
}
export function openExternalUser(username: string) {
  shell.openExternal(`https://civitai.com/user/${username}`).catch((e) => {
    errorLog(e);
  });
}

function errorLog(e: any) {
  console.error('Error opening an external link (Electron Shell API)', e);
}
