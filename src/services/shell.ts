import {shell} from "electron";

export function OpenExternalModelLink(id: number) {
  shell.openExternal(`https://civitai.com/models/${id}`)
}
export function OpenExternalUser(username: string) {
  shell.openExternal(`https://civitai.com/user/${username}`)
}
