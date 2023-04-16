import { clipboard } from 'electron';
import { openToast } from '@/services/toast';

export function clipboardSet(text: string) {
  clipboard.write({ text });
  openToast('Copied!');
}
