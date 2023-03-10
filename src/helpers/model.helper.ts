import { Model } from '@/interfaces/models.interface';
import path from 'node:path';

export function ModelFileNamePrune(model: Model | string) {
  let text = typeof model === 'string' ? model : model.file;
  if (text.length <= 0) return '';
  text = path.parse(text).name;
  text = text.charAt(0).toUpperCase() + text.slice(1);
  text = text
    .replaceAll('ckpt', '')
    .replaceAll('pruned', '')
    .replaceAll('safetensor', '')
    .replace('safetensors', '')
    .replaceAll('-', ' ')
      .replaceAll('_', ' ')
  let split = text.split(' ');
  let chunked: string[] = [];
  for(const i of split) {
      let words = i.split(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/) //TitleCase to words
      chunked = [...chunked, ...words];
  }

  for(let i =0;i< chunked.length;i++) {
      const chunk = chunked[i];

      if (/^(v?[0-9.]+$)/i.test(chunk)) {
          chunked[i] = '';
      }
  }
  return chunked.filter(x => x).join(' ').trim();
}
