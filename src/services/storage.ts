import path from 'node:path';
import fs from 'node:fs/promises';
import {Model, ModelImage} from '@/interfaces/models.interface';
import { API } from '@/api';
import {until, wait} from "@/helpers/promise.helper";
import * as exif from 'exifr';

let STORAGE_PATH: string, STORAGE_MODELS_PATH: string, STORAGE_ASSETS_PATH: string;

interface StorageModels {
  lastUpdate: string;
  models: Model[];
}

export const StorageEngine = (fileName: string) => {
  const getPath = () => path.join(STORAGE_PATH, fileName + '.json');
  const checkPath = async () => {
    await waitForElectronCallback();
    if (! await fileExists(getPath())) {
      await fs.writeFile(getPath(), JSON.stringify({}))
    }
  }
  const getFileContent = async () => {
    await checkPath();
    return JSON.parse((await fs.readFile(getPath())).toString());
  }
  const setFileContent = async (object: any) => {
    await checkPath();
    return await fs.writeFile(getPath(), JSON.stringify(object));
  }

  return {
    getItem: async (key: string): Promise<any> => {
      return (await getFileContent())[key] ?? undefined;
    },
    setItem: async (key: string, value: any) => {
      const current = await getFileContent();
      current[key] = value;
      return await setFileContent(current);
    },
    removeItem: async (key: string) => {
      const current = await getFileContent();
      current[key] = undefined;
      return await setFileContent(current);
    }
  }
}

export async function StorageGetModels() {
  await checkStorage();
  const file = await fs.readFile(STORAGE_MODELS_PATH);
  console.log('Reading models from disk...');
  return JSON.parse(file.toString()) as StorageModels;
}

export async function StorageSetModels(models: Model[]) {
  await checkStorage();
  await fs.writeFile(STORAGE_MODELS_PATH, generateModelsJson({ models: models }));
  console.log('...New data saved to disk...');
}

export async function ImportAssets(files: File[]): Promise<ModelImage[]> {
  await checkStorage();

  const unix = new Date().getTime();
  const assets: ModelImage[] = [];
  for (let file of files) {
    const fileName = `${file.name.length > 5 ? file.name.slice(0, 6) : file.name}-${unix}${path.extname(file.name)}`;
    const data = await fs.readFile(file.path);
    const metadata = await generateModelImageBuffer(data);
    const newPath = path.join(STORAGE_ASSETS_PATH, fileName);
    await fs.writeFile(newPath, data);
    assets.push({
      url: fileName,
      ...metadata
    });
  }
  console.log('New Assets:', assets);
  return assets;
}

async function generateModelImageBuffer(data: Buffer): Promise<Omit<ModelImage, 'url'>> {
  const meta = await exif.parse(data, true);

  let prompt, negative, steps, hash, cfg, seed, sampler;

  if (meta.parameters) {
    const chunks = meta.parameters.split('\n');
    prompt = chunks.length > 0 ? chunks[0] : undefined;
    negative = chunks.length > 1 ? chunks[1].substring(18) : undefined;
    const infoChunk = chunks.length > 2 ? (chunks[2] as string).split(', ').reduce((pre, cur) => {
      const entry = cur.split(': ');
      if (entry.length <= 1) return pre;
      pre[entry[0]] = entry[1];
      return pre;
    }, {} as any) : undefined;
    if (infoChunk && Object.keys(infoChunk).length > 0) {
      steps = infoChunk['Steps'];
      hash = infoChunk['Model hash'];
      cfg = infoChunk['CFG scale'];
      seed = infoChunk['Seed'];
      sampler = infoChunk['Sampler'];
    }
  }
  console.log(meta);
  return {
    width: meta.ImageWidth,
    height: meta.ImageHeight,
    meta: {prompt, negativePrompt: negative, steps, hash, seed, sampler, cfgScale: cfg}
  }
}

async function waitForElectronCallback() {
  return await until(() => API().UserDataPath !== null);
}

async function checkStorage() {

  STORAGE_PATH = path.join(API().UserDataPath!, 'Data');
  STORAGE_MODELS_PATH = path.join(STORAGE_PATH, 'models.json');
  STORAGE_ASSETS_PATH = path.join(STORAGE_PATH, 'assets');

  if (!(await fileExists(STORAGE_PATH))) {
    await fs.mkdir(STORAGE_PATH);
  }
  if (!(await fileExists(STORAGE_ASSETS_PATH))) {
    await fs.mkdir(STORAGE_ASSETS_PATH);
  }
  if (!(await fileExists(STORAGE_MODELS_PATH))) {
    await fs.writeFile(STORAGE_MODELS_PATH, generateModelsJson({ models: [] }));
  }

  await wait(100);
}

async function fileExists(path: string) {
  return fs
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

function generateModelsJson(options: Omit<StorageModels, 'lastUpdate'>) {
  return JSON.stringify(
    {
      ...options,
      lastUpdate: new Date().toISOString(),
    } as StorageModels,
    undefined,
    2,
  );
}
