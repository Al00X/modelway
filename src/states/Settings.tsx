import {atom} from "jotai";
import {atomWithStorage, createJSONStorage} from "jotai/utils";
import {StorageEngine} from "@/services/storage";

export class SettingsState {
  private static _storage = createJSONStorage<any>(() => StorageEngine('settings'));

  static isNSFWToggled = atomWithStorage<boolean>('nsfw-mode',false, this._storage);
}
