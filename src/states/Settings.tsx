import { RESET } from 'jotai/utils';
import { atom } from 'jotai';
import { SortDirection, SortType, TruncateViewType, ViewType } from '@/interfaces/app.interface';
import { ModelType } from '@/interfaces/models.interface';

// import {StorageEngine} from "@/services/storage";

type SetStateActionWithReset<Value> = Value | typeof RESET | ((prev: Value) => Value | typeof RESET);

export type UserPaths = Partial<{ [key in ModelType]: string }> & { Client?: string };

const atomWithLocalStorage = <T,>(key: string, initialValue: T, storage: undefined) => {
  const getInitialValue = () => {
    const item = localStorage.getItem(key);

    if (item !== null) {
      return JSON.parse(item) as T;
    }

    return initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: SetStateActionWithReset<T>) => {
      const nextValue =
        typeof update === 'function' ? (update as (prev: T) => T | typeof RESET)(get(baseAtom)) : update;

      if (nextValue === RESET) {
        set(baseAtom, initialValue);

        localStorage.removeItem(key);

        return;
      }
      set(baseAtom, nextValue);

      localStorage.setItem(key, JSON.stringify(nextValue));
    },
  );

  return derivedAtom;
};

export class SettingsState {
  // private static _storage = StorageEngine('settings');
  private static _storage = undefined;

  static isNSFWToggled = atomWithLocalStorage<boolean>('nsfw-mode', false, this._storage);
  static viewMode = atomWithLocalStorage<ViewType>('view-mode', 'grid', this._storage);
  static truncateViewMode = atomWithLocalStorage<TruncateViewType>('truncate-view-mode', 'all', this._storage);
  static sortMode = atomWithLocalStorage<SortType>('sort-mode', 'alphabet', this._storage);
  static sortDirection = atomWithLocalStorage<SortDirection>('sort-direction', 'asc', this._storage);
  static userPaths = atomWithLocalStorage<UserPaths>('user-paths', {}, this._storage);
  static isFirstLaunch = atomWithLocalStorage('first-launch', true, this._storage);
}
