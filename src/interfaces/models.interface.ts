export type ModelType =
  | 'Checkpoint'
  | 'TextualInversion'
  | 'Hypernetwork'
  | 'AestheticGradient'
  | 'LORA'
  | 'Controlnet'
  | 'Poses'
  | 'Misc';

export interface Model {
  file: string;
  hash: string;
  metadata: {
    id?: number;
    name?: string;
    modelId?: number;
    modelName?: string;
    description?: string;
    type: ModelType;
    nsfw?: boolean;
    creator?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
    triggers: string[];
    baseModel: string;
    merges: (string | false)[] | false;
    hashes: { [p: string]: string };
    images: ModelImage[];
    notes?: string;
  };
}

export interface ModelImage {
  url: string;
  nsfw?: boolean;
  width?: number;
  height?: number;
  hash?: string;
  meta?: {
    Size?: string;
    seed?: number;
    steps?: number;
    prompt?: string;
    sampler?: string;
    cfgScale?: number;
    hash?: string;
    negativePrompt?: string;
  };
}
