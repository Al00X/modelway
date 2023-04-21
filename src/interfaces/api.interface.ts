import { Model, ModelType } from '@/interfaces/models.interface';

export interface CivitPaginatedResult<T> {
  items: T[];
  metadata: {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
}
export interface CivitModel {
  id: number;
  name: string;
  description: string; // html
  type: ModelType;
  poi: boolean;
  nsfw: boolean;
  allowNoCredit: boolean;
  allowCommercialUse: 'Sell' | 'Image' | string;
  allowDerivatives: boolean;
  allowDifferentLicense: boolean;
  stats: {
    downloadCount: number;
    favoriteCount: number;
    commentCount: number;
    ratingCount: number;
    rating: number;
  };
  creator: {
    username: string;
    image: string;
  };
  tags: (string | { name: string })[];
  modelVersions: CivitModelVersion[];
}

export interface CivitModelVersion {
  id: number;
  modelId: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  trainedWords: string[];
  baseModel: string;
  earlyAccessTimeFrame: number;
  description: string | null; // in html
  model?: {
    name: string;
    type: ModelType;
    nsfw: boolean;
    poi: boolean;
  };
  files: CivitModelFile[];
  images: CivitModelImage[];
  downloadUrl: string;
}

export interface CivitModelImage {
  url: string;
  nsfw: boolean;
  width: number;
  height: number;
  hash: string;
  meta: null | {
    Size: string;
    seed: number;
    steps: number;
    prompt: string;
    sampler: string;
    cfgScale: number;
    'Batch pos': string;
    'Batch size': string;
    'Model hash': string;
    negativePrompt: string;
  };
  generationProcess: string;
  needsReview: boolean;
  tags: {
    tag: {
      id: number;
      name: string;
      isCategory: boolean;
    };
    automated: boolean;
  }[];
}

export interface CivitModelFile {
  name: string; // file name
  id: number;
  sizeKB: number;
  type: 'Model' | 'VAE' | 'Config' | string;
  format: string;
  pickleScanResult: 'Success' | string;
  pickleScanMessage: string;
  virusScanResult: 'Success' | string;
  scannedAt: string;
  hashes: CivitFileHashes;
  primary: boolean;
  downloadUrl: string;
}

export interface CivitFileHashes {
  SHA256?: string;
  AutoV1?: string;
  AutoV2?: string;
  BLAKE3?: string;
  CRC32?: string;
}
