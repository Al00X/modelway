import { clipboard } from 'electron';
import { openToast } from '@/services/toast';

export function clipboardSet(text: string | undefined) {
  if (text && text !== '') {
    clipboard.write({ text });
    openToast('Copied!');
  } else {
    openToast('Nothing To Copy!');
  }
}

export function clipboardGet() {
  return clipboard.readText();
}
