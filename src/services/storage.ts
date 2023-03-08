import path from 'node:path';
import fs from 'node:fs/promises';
import { Model } from '@/interfaces/models.interface';
import { API } from '@/samples/node-api';

const STORAGE_PATH = path.join(API().UserDataPath, 'Data');
const STORAGE_MODELS_PATH = path.join(STORAGE_PATH, 'models.json');
const STORAGE_ASSETS_PATH = path.join(STORAGE_PATH, 'assets');

interface StorageModels {
  lastUpdate: string;
  models: Model[];
}

checkStorage();

export async function StorageGetModels() {
  await checkStorage();
  const file = await fs.readFile(STORAGE_MODELS_PATH);
  return JSON.parse(file.toString()) as StorageModels;
}

export async function StorageSetModels(models: Model[]) {
  await checkStorage();
  await fs.writeFile(STORAGE_MODELS_PATH, generateModelsJson({ models: models }));
}

async function checkStorage() {
  if (!(await fileExists(STORAGE_PATH))) {
    await fs.mkdir(STORAGE_PATH);
  }
  if (!(await fileExists(STORAGE_ASSETS_PATH))) {
    await fs.mkdir(STORAGE_ASSETS_PATH);
  }
  if (!(await fileExists(STORAGE_MODELS_PATH))) {
    await fs.writeFile(STORAGE_MODELS_PATH, generateModelsJson({ models: [] }));
  }
  console.log(`storage ready: `, STORAGE_MODELS_PATH);
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
