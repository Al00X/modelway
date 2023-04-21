import path from 'node:path';
import axios from 'axios';
import { ModelImage } from '@/interfaces/models.interface';
import { STORAGE_ASSETS_PATH } from '@/services/storage';
import { fileExists } from '@/helpers/node.helper';

export function resolveImage(image: ModelImage | string) {
  const url = typeof image === 'string' ? image : image.url;

  if (url.includes('http')) {
    return url;
  }
  if (url.includes(':') && url.includes('\\')) {
    return `file://${url}`;
  }

  return `asset://${url}`;
}

export function resolveImageUrlToPath(src: string) {
  if (src.startsWith('file://')) return src.substring(7);
  if (src.startsWith('asset://')) return path.join(STORAGE_ASSETS_PATH, src.substring(8));

  return src;
}

export function generateImageFilenameFromUrl(url: string) {
  return url.startsWith('http')
    ? url.substring(url.indexOf('/', url.indexOf('.com/') + 5) + 1).replaceAll('/', '_')
    : null;
}

export function urlContainsProtocol(url: string) {
  return url.includes('file://') || url.includes('asset://');
}

export function assetExistsByUrl(url: string) {
  return fileExists(resolveImageUrlToPath(url));
}
export function assetExistsByFilename(filename: string) {
  return fileExists(path.join(STORAGE_ASSETS_PATH, filename));
}

export async function imageToUrl(
  model: string | ModelImage,
  fileOnly?: boolean,
): Promise<{
  type: 'http' | 'file' | 'cache';
  path: string;
} | null> {
  const url = resolveImage(model);
  const containsProtocol = urlContainsProtocol(url);

  if (containsProtocol) {
    const exists = resolveImageUrlToPath(url);

    return exists ? { type: 'file', path: url } : null;
  }
  const cachedName = generateImageFilenameFromUrl(url);

  if (cachedName) {
    const resolvedCache = resolveImage(cachedName);
    const exists = await fileExists(resolveImageUrlToPath(resolvedCache));

    return exists ? { type: 'cache', path: resolvedCache } : fileOnly ? null : { type: 'http', path: url };
  }

  return fileOnly ? null : { type: 'http', path: url };
}

export async function imageFetch(
  model: string | ModelImage,
  blob?: boolean,
): Promise<{ filename?: string; blob?: Blob; src: string }> {
  const url = await imageToUrl(model);

  if (url?.type === 'http') {
    const filename = generateImageFilenameFromUrl(url.path);

    const result = await axios.get(url.path, { responseType: 'blob' });

    return {
      blob: result.data,
      filename: filename ?? undefined,
      src: resolveImage(filename!),
    };
  }

  return {
    src: url!.path,
  };
}
