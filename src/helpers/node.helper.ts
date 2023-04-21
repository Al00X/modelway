import fs, { readdir, access, constants } from 'node:fs/promises';
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

export async function checkFilePermission(file: string, permissions: 'read' | 'readwrite') {
  return access(file, permissions === 'read' ? constants.R_OK : constants.R_OK | constants.W_OK)
    .then(() => true)
    .catch(() => false);
}

export async function checkDirPermission(dir: string, permissions: 'read' | 'readwrite') {
  const dirHasPerm = await checkFilePermission(dir, permissions);

  if (!dirHasPerm) return false;
  try {
    const dirFiles = await readdir(dir, { withFileTypes: true });

    for (const i of dirFiles) {
      if (i.isFile()) {
        const path = resolve(dir, i.name);
        const filePerm = await checkFilePermission(path, permissions);

        return filePerm;
      }
    }
  } catch {
    return false;
  }

  return true;
}

export async function copyFile(path: string, destination: string) {
  await fs.copyFile(path, destination);
}
