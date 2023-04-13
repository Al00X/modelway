import {CivitFileHashes, CivitModelFile} from "@/interfaces/api.interface";

export type ModelType =
  | 'Checkpoint'
  | 'TextualInversion'
  | 'Hypernetwork'
  | 'AestheticGradient'
  | 'LORA'
  | 'Controlnet'
  | 'Poses'
  | 'Misc';

export interface ModelVersion {
  id?: number;
  modelId?: number;
  fileName?: string;
  triggers?: string[];
  baseModel?: string;
  name?: string;
  description?: string | null;
  merges?: (string | false)[];
  images?: ModelImage[];
  createdAt?: string;
  updatedAt?: string;
  files?: CivitModelFile[],
  hashes?: CivitFileHashes
}

export interface Model {
  id: number;
  fullPath: string;
  file: string;
  hash: string;
  hide?: boolean;
  metadata: {
    id?: number;
    name?: string;
    description?: string;
    type: ModelType;
    nsfw?: boolean;
    creator?: string;
    tags?: string[];
    coverImage?: ModelImage;
    notes?: string;
    currentVersion: ModelVersion,
    versions?: ModelVersion[],
    originalValues?: Model['metadata'],
  };
}

export interface ModelImage {
  url: string;
  nsfw?: boolean;
  width?: number;
  height?: number;
  hash?: string;
  hide?: boolean;
  meta?: {
    seed?: number;
    steps?: number;
    prompt?: string;
    sampler?: string;
    cfgScale?: number;
    hash?: string;
    negativePrompt?: string;
  };
}

export interface ModelExtended extends Model {
  computed: {
    name: string;
    keyImages: {
      single: ModelImage | null;
      double: ModelImage[];
      triple: ModelImage[];
    };
  }
}
