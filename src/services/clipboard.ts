import {clipboard} from "electron";
import {openToast} from "@/services/toast";

export function ClipboardSet(text: string) {
  clipboard.write({ text });
  openToast('Copied!');
}
