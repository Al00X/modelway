import { readdir, access, constants } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Get a list of file paths available inside a directory, it searches through all available subfolders.
 *
 * @param dir- Path of the directory to search into.
 */
export async function getFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = resolve(dir, dirent.name);

      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );

  // eslint-disable-next-line unicorn/prefer-spread
  return Array.prototype.concat(...files);
}

// Check if a file exists...
export async function fileExists(path: string) {
  return access(path, constants.F_OK)
    .then(() => true)
    .catch(() => false);
}
