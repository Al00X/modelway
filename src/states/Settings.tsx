import {atomWithStorage, RESET} from "jotai/utils";
import {SortDirection, SortType, TruncateViewType, ViewType} from "@/interfaces/app.interface";
import {atom} from "jotai";
// import {StorageEngine} from "@/services/storage";

type SetStateActionWithReset<Value> =
  | Value
  | typeof RESET
  | ((prev: Value) => Value | typeof RESET)

const atomWithLocalStorage = <T,>(key: string, initialValue: T, storage = undefined) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key)
    if (item !== null) {
      return JSON.parse(item) as T
    }
    return initialValue
  }
  const baseAtom = atom(getInitialValue())
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: SetStateActionWithReset<T>) => {
      const nextValue =
        typeof update === 'function'
          ? (update as (prev: T) => T | typeof RESET)(get(baseAtom))
          : update
      if (nextValue === RESET) {
        set(baseAtom, initialValue)
        return localStorage.removeItem(key)
      }
      set(baseAtom, nextValue)
      return localStorage.setItem(key, JSON.stringify(nextValue))
    }
  )
  return derivedAtom
}

export class SettingsState {
  // private static _storage = StorageEngine('settings');
  private static _storage = undefined;

  static isNSFWToggled = atomWithLocalStorage<boolean>('nsfw-mode',false, this._storage);
  static viewMode = atomWithLocalStorage<ViewType>('view-mode','grid', this._storage);
  static truncateViewMode = atomWithLocalStorage<TruncateViewType>('truncate-view-mode','recognized', this._storage);
  static sortMode = atomWithLocalStorage<SortType>('sort-mode', 'alphabet', this._storage);
  static sortDirection = atomWithLocalStorage<SortDirection>('sort-direction', 'asc', this._storage);
}
