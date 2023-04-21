import { ModelImage } from '@/interfaces/models.interface';

export function resolveImage(image: ModelImage | string) {
  const url = typeof image === 'string' ? image : image.url;

  if (url.includes('http')) {
    return url;
  }
  if (url.includes(':') && url.includes('\\')) {
    return `file:///${url}`;
  }

  return `assets://${url}`;
}
