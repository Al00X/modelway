import { Model, ModelImage, ModelVersion } from '@/interfaces/models.interface';
import path from 'node:path';
import { CivitModel, CivitModelFile, CivitModelImage, CivitModelVersion } from '@/interfaces/api.interface';
import { GetModelHash } from '@/services/scan';

export function ModelFileNamePrune(model: Model | string) {
  let text = typeof model === 'string' ? model : model.file;
  if (text.length <= 0) return '';
  text = path.parse(text).name;
  text = text.charAt(0).toUpperCase() + text.slice(1);
  text = text
    .replaceAll('ckpt', '')
    .replaceAll('pruned', '')
    .replaceAll('safetensor', '')
    .replace('safetensors', '')
    .replaceAll('-', ' ')
    .replaceAll('_', ' ');
  let split = text.split(' ');
  let chunked: string[] = [];
  for (const i of split) {
    let words = i.split(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/); //TitleCase to words
    chunked = [...chunked, ...words];
  }

  for (let i = 0; i < chunked.length; i++) {
    const chunk = chunked[i];

    if (/^(v?[0-9.]+$)/i.test(chunk)) {
      chunked[i] = '';
    }
  }
  return chunked
    .filter((x) => x)
    .join(' ')
    .trim();
}

export function CivitModelToModel(model: CivitModel, previousModel?: Model): Partial<Model> {
  // model.
  const imageMap = (v: CivitModelImage): ModelImage => {
    return {
      url: v.url,
      hash: v.hash,
      width: v.width,
      height: v.height,
      nsfw: v.nsfw,
      meta: v.meta ? {
        seed: v.meta.seed,
        steps: v.meta.steps,
        sampler: v.meta.sampler,
        prompt: v.meta.prompt,
        negativePrompt: v.meta.negativePrompt,
        cfgScale: v.meta.cfgScale,
        hash: v.meta['Model hash'],
      } : undefined,
    };
  };
  const versionMap = (v: CivitModelVersion, file?: CivitModelFile | null): ModelVersion => {
    return {
      id: v.id,
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
      hashes: file?.hashes
    };
  };

  const currentVersion =
    model.modelVersions.length === 1
      ? model.modelVersions[0]
      : !previousModel
      ? model.modelVersions[0]
      : model.modelVersions.find((x) =>
          x.files.find((y) => y.name === previousModel.file || y.hashes['AutoV1']?.toLowerCase() === previousModel.hash),
        ) ?? null;
  let currentVersionFile: CivitModelFile | null = null;
  if (!currentVersion && previousModel) {
    // const sha256 = GetModelHash(previousModel, 'sha256');
    console.error(`Version YOKH NIGGA: ${previousModel.file ?? model.name}`);
  }
  if (currentVersion) {
    currentVersionFile = previousModel
      ? currentVersion.files.find((x) => x.name === previousModel.file || x.hashes['AutoV1']?.toLowerCase() === previousModel.hash) ??
        null
      : currentVersion.files.find((x) => x.primary) ?? null;
    if (!currentVersionFile) {
        currentVersionFile = currentVersion.files[0]
    }
  }

  const mapped: Model['metadata'] = {
    id: model.id,
    name: model.name,
    nsfw: model.nsfw,
    description: model.description,
    creator: model.creator.username,
    type: model.type,
    tags: model.tags,
    currentVersion: currentVersion ? versionMap(currentVersion, currentVersionFile) : {},
    versions: model.modelVersions.map((x) => versionMap(x)),
  };
  return {
    ...previousModel,
    metadata: {
      ...previousModel?.metadata,
      type: previousModel?.metadata?.type ?? model.type,
      currentVersion: previousModel?.metadata?.currentVersion ?? {},
      originalValues: mapped,
    },
  };
}

export function MergeModelDetails(model: Model): Model {
  if (!model.metadata.originalValues) {
    console.warn(`Model has no available server data for merging: ${model.file}`);
    return model;
  }

  return {
    ...model,
    metadata: {
      ...model.metadata.originalValues,
      ...model.metadata,
      currentVersion: {
        ...model.metadata.originalValues.currentVersion,
        ...model.metadata.currentVersion,
      },
      versions: undefined,
    }
  }
}