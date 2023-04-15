import * as fs from 'node:fs/promises';
import * as path from 'node:path';

/**
 * Get a list of file paths available inside a directory, it searches through all available subfolders
 * @param dir path of the directory to search into
 */
export async function getFiles(dir: string): Promise<string[]> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }),
  );
  return Array.prototype.concat(...files);
}

// Check if a file exists...
export async function fileExists(path: string) {
  return fs
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}
