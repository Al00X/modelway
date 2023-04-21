import fs from 'node:fs/promises';
import { extname, basename, parse } from 'node:path';
import { createHash } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { createBLAKE3, createCRC32, createSHA256 } from 'hash-wasm';
import { Model, ModelType } from '@/interfaces/models.interface';
import { getFiles } from '@/helpers/node.helper';
import { textIncludesArray } from '@/helpers/native.helper';
import { UserPaths } from '@/states/Settings';

const MODEL_EXTENSIONS = ['.safetensors', '.ckpt', '.pt', '.base'];
const VAE_EXTENSIONS = ['.safetensors', '.ckpt', '.pt'];
const THUMBNAIL_EXTENSIONS = ['.png', '.jpg', '.jpeg'];
const INFO_EXTENSIONS = ['.info'];
const CONFIG_EXTENSIONS = ['.yaml'];

const MODEL_BLACKLIST = ['pix2pix', '.vae', '_vae.', 'inpainting', 'x4-upscaler', 'v2-512-depth'];
const VAE_WHITELIST = ['.vae', '_vae.'];

type HashAlgorithms = 'autoV1' | 'sha256' | 'crc32' | 'blake3';

interface FileEntry {
  path: string;
  filename: string;
}
export interface ModelScanEntry {
  model: FileEntry;
  vae?: FileEntry;
  thumbnail?: FileEntry;
  info?: FileEntry;
  config?: FileEntry;
}

export async function scanModelDirectory(userPaths: UserPaths, type: ModelType): Promise<ModelScanEntry[]> {
  const dir = userPaths[type];

  if (!dir) {
    throw new Error(`We do no yet a ${type}`);
  }
  let files: string[];

  try {
    files = await getFiles(dir);
  } catch (e) {
    console.error(e);

    return [];
  }

  const models: FileEntry[] = [];
  const infos: FileEntry[] = [];
  const thumbs: FileEntry[] = [];
  const vaes: FileEntry[] = [];
  const configs: FileEntry[] = [];

  for (const filePath of files) {
    const entry: FileEntry = {
      filename: basename(filePath),
      path: filePath,
    };

    if (INFO_EXTENSIONS.includes(extname(filePath))) {
      infos.push(entry);
    } else if (THUMBNAIL_EXTENSIONS.includes(extname(filePath))) {
      thumbs.push(entry);
    } else if (CONFIG_EXTENSIONS.includes(extname(filePath))) {
      configs.push(entry);
    } else if (VAE_EXTENSIONS.includes(extname(filePath)) && textIncludesArray(filePath, VAE_WHITELIST)) {
      vaes.push(entry);
    } else if (MODEL_EXTENSIONS.includes(extname(filePath)) && !textIncludesArray(filePath, MODEL_BLACKLIST)) {
      models.push(entry);
    }
  }

  return models.map((model) => {
    const modelName = parse(model.filename).name;

    return {
      model,
      vae: vaes.find((t) => t.filename.includes(modelName)),
      thumbnail: thumbs.find((t) => t.filename.includes(modelName)),
      info: infos.find((t) => t.filename.includes(modelName)),
      config: configs.find((t) => t.filename.includes(modelName)),
    };
  });
}

export async function getModelHash(model: FileEntry, algorithm: HashAlgorithms) {
  const file = await fs.open(model.path, 'r+');

  console.log(`Hashing ${algorithm.toUpperCase()}: ${model.filename}`);
  const hash = await getModelHashByFile(file, model.path, algorithm);

  console.log(`${hash}`);
  await file.close();

  return hash;
}

export async function getModelHashByFile(
  file: fs.FileHandle,
  path: string,
  algorithm: HashAlgorithms,
): Promise<string> {
  switch (algorithm) {
    case 'autoV1': {
      const pos = 0x100000;
      const length = 0x10000;
      const result = await file.read(Buffer.alloc(length), 0, length, pos);

      return createHash('sha256').update(result.buffer).digest('hex').substring(0, 8);
    }
    // TODO: crc32 hashing mechanism is not the same as civitAi... blake3 and sha256 are good
    case 'crc32':
    case 'sha256':
    case 'blake3': {
      const hasher = await (algorithm === 'sha256'
        ? createSHA256()
        : algorithm === 'crc32'
        ? createCRC32()
        : createBLAKE3());

      return new Promise((resolve, reject) => {
        const stream = file.createReadStream({
          highWaterMark: 1024 * 1024 * 256,
        });

        stream.on('error', (err) => {
          reject(err);
        });
        stream.on('data', (d) => {
          hasher.update(d);
        });
        stream.on('end', () => {
          resolve(hasher.digest());
        });
      });
    }
  }
}
