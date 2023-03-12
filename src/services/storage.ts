import path from 'node:path';
import fs from 'node:fs/promises';
import { Model } from '@/interfaces/models.interface';
import { API } from '@/samples/node-api';
import {until} from "@/helpers/promise.helper";

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
  console.log('Writing models to disk...');
  await fs.writeFile(STORAGE_MODELS_PATH, generateModelsJson({ models: models }));
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
