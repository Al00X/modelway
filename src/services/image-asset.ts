import { ModelImage } from '@/interfaces/models.interface';

export function resolveImage(image: ModelImage | string) {
  const url = typeof image === 'string' ? image : image.url;

  if (url.includes('http')) {
    return url;
  }

  return `assets://${url}`;
}
