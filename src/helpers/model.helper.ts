import path from 'node:path';
import { Model, ModelExtended, ModelImage, ModelVersion } from '@/interfaces/models.interface';
import { CivitModel, CivitModelFile, CivitModelImage, CivitModelVersion } from '@/interfaces/api.interface';
import { findAllIndexes, mergeArray } from '@/helpers/native.helper';

function cleanupTextFromShit(text: string) {
  return text
    .replaceAll(/ckpt/gi, '')
    .replaceAll(/pruned/gi, '')
    .replaceAll(/safetensor(s*)/gi, '')
    .replaceAll('-', ' ')
    .replaceAll('_', ' ');
}

export function modelFileNamePrune(model: Model | string) {
  let text = typeof model === 'string' ? model : model.filename;

  if (text.length <= 0) return '';
  text = path.parse(text).name;
  text = text.charAt(0).toUpperCase() + text.slice(1);
  text = cleanupTextFromShit(text);
  const split = text.split(' ');
  let chunked: string[] = [];

  for (const i of split) {
    const words = i.split(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/); //TitleCase to words

    chunked = [...chunked, ...words];
  }

  for (let i = 0; i < chunked.length; i++) {
    const chunk = chunked[i];

    if (/^(v?[\d.]+$)/i.test(chunk)) {
      chunked[i] = '';
    }
  }

  return chunked.filter(Boolean).join(' ').trim();
}

export function modelVersionNamePrune(model: Model | string) {
  const text = typeof model === 'string' ? model : model.metadata.currentVersion.name;

  if (!text) return '';

  return cleanupTextFromShit(text);
}

export function civitModelToModel(model: CivitModel, previousModel: Model): Model;
export function civitModelToModel(model: CivitModel, previousModel?: Model): Partial<Model> {
  const imageMap = (v: CivitModelImage): ModelImage => {
    return {
      url: v.url,
      hash: v.hash,
      width: v.width,
      height: v.height,
      nsfw: v.nsfw,
      meta: v.meta
        ? {
            seed: v.meta.seed,
            steps: v.meta.steps,
            sampler: v.meta.sampler,
            prompt: v.meta.prompt,
            negativePrompt: v.meta.negativePrompt,
            cfgScale: v.meta.cfgScale,
            hash: v.meta['Model hash'],
          }
        : undefined,
    };
  };
  const versionMap = (v: CivitModelVersion, file?: CivitModelFile | null): ModelVersion => {
    return {
      id: v.id,
      fileId: file?.id,
      modelId: v.id,
      name: v.name,
      description: v.description,
      baseModel: v.baseModel,
      images: v.images.map(imageMap),
      merges: undefined,
      triggers: v.trainedWords,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      files: file ? undefined : v.files,
      fileName: file?.name,
      hashes: file?.hashes,
    };
  };

  const currentVersion =
    model.modelVersions.length === 1
      ? model.modelVersions[0]
      : !previousModel
      ? model.modelVersions[0]
      : model.modelVersions.find((x) =>
          x.files.find(
            (y) => y.name === previousModel.filename || y.hashes.AutoV1?.toLowerCase() === previousModel.hash,
          ),
        ) ?? null;
  let currentVersionFile: CivitModelFile | null = null;

  if (!currentVersion && previousModel) {
    // const sha256 = GetModelHash(previousModel, 'sha256');
    console.error(`Version YOKH NIGGA: ${previousModel.filename ?? model.name}`);
  }
  if (currentVersion) {
    currentVersionFile = previousModel
      ? currentVersion.files.find(
          (x) => x.name === previousModel.filename || x.hashes.AutoV1?.toLowerCase() === previousModel.hash,
        ) ?? null
      : currentVersion.files.find((x) => x.primary) ?? null;
    if (!currentVersionFile) {
      currentVersionFile = currentVersion.files[0];
    }
  }

  const mapped: Model['metadata'] = {
    id: model.id,
    name: model.name,
    nsfw: model.nsfw,
    description: model.description,
    creator: model.creator.username,
    type: model.type,
    tags: model.tags.map((x) => (typeof x === 'string' ? x : x.name)),
    currentVersion: currentVersion ? versionMap(currentVersion, currentVersionFile) : {},
    versions: model.modelVersions.map((x) => versionMap(x)),
  };

  return {
    ...previousModel,
    metadata: {
      ...previousModel?.metadata,
      type: previousModel?.metadata.type ?? model.type,
      currentVersion: previousModel?.metadata.currentVersion ?? {},
      originalValues: mapped,
    },
  };
}

export function mergeModelDetails(model: Model): Model {
  if (!model.metadata.originalValues) {
    // console.warn(`Model has no available server data for merging: ${model.filename}`);
    return model;
  }

  const originalCurrentVersion = model.metadata.originalValues.currentVersion;
  const { currentVersion } = model.metadata;

  return {
    ...model,
    metadata: {
      ...model.metadata.originalValues,
      ...model.metadata,
      tags: mergeArray(model.metadata.tags, model.metadata.originalValues.tags),
      currentVersion: {
        ...originalCurrentVersion,
        ...currentVersion,
        images: mergeArray(currentVersion.images, originalCurrentVersion.images, 'url'),
        triggers: mergeArray(currentVersion.triggers, originalCurrentVersion.triggers),
        merges: mergeArray(currentVersion.merges, []),
      },
      versions: undefined,
    },
  };
}

export function modelPopulateComputedValues(model: Model): ModelExtended {
  let name =
    model.metadata.name ??
    model.filename.substring(0, model.filename.lastIndexOf('.')).replaceAll('_', ' ').replaceAll('-', ' ');
  let version = model.metadata.currentVersion.name
    ? modelVersionNamePrune(model.metadata.currentVersion.name)
    : undefined;

  version = version?.replaceAll(new RegExp(`${name}`, 'gi'), '').trim();
  name = name
    .replaceAll(new RegExp(`${version ?? ''}`, 'gi'), '')
    .replaceAll('()', '')
    .replaceAll('[]', '')
    .trim();

  // ----- VAE & Config
  let hasVAE: ModelExtended['computed']['hasVAE'];
  let hasConfig: ModelExtended['computed']['hasConfig'];
  const vaeFileStatus: typeof hasVAE =
    model.vaePath !== undefined ? 'external' : model.filename.toLowerCase().includes('bakedvae') ? 'baked' : undefined;
  const configFileStatus: typeof hasConfig = model.configPath !== undefined ? 'yes' : undefined;

  const versionObject = model.metadata.originalValues?.versions?.find((v) => v.id === model.metadata.currentVersion.id);
  const fileOriginalName = versionObject?.files?.find((t) => t.id === model.metadata.currentVersion.fileId)?.name;
  const versionContainsVaeFile = versionObject?.files?.some((t) => t.type === 'VAE');
  const versionContainsConfigFile = versionObject?.files?.some((t) => t.type === 'Config');

  if (vaeFileStatus === 'external') {
    hasVAE = 'external';
  } else if (fileOriginalName?.toLowerCase().includes('bakedvae') || vaeFileStatus === 'baked') {
    hasVAE = 'baked';
  } else if (versionContainsVaeFile && vaeFileStatus === undefined) {
    hasVAE = 'missing';
  } else if (versionContainsVaeFile === false) {
    hasVAE = 'none';
  }

  if (configFileStatus === 'yes') {
    hasConfig = 'yes';
  } else if (versionContainsConfigFile) {
    hasConfig = 'missing';
  } else if (versionContainsConfigFile === false) {
    hasConfig = 'none';
  }
  // -----

  return {
    ...model,
    computed: {
      name,
      recognized: model.metadata.currentVersion && Object.values(model.metadata.currentVersion).length > 0,
      version,
      hasVAE,
      hasConfig,
    },
  };
}

export function modelsDeduplicate(models: Model[]) {
  let toRemove: number[] = [];

  for (let i = 0; i < models.length; i++) {
    if (toRemove.includes(i)) continue;

    const model = models[i];

    const matches = findAllIndexes(models, (x, index) => {
      return (
        i !== index &&
        ((x.filename !== '' && model.filename === x.filename) ||
          (x.metadata.id !== -1 && !!x.metadata.id && model.metadata.id === x.metadata.id))
      );
    });

    toRemove = [...toRemove, ...matches];
  }
  for (const qwe of toRemove) {
    console.log('DEDUP', models[qwe]);
  }

  return models.filter((x, i) => !toRemove.includes(i));
}
