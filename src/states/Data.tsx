import {atom} from "jotai";

export class DataState {
  static availableTags = atom<string[]>([]);
}
