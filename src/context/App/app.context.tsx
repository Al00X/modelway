import { createContext } from 'react';
import { ProgressEvent } from '@/context/App/app.provider';
import { Model, ModelType } from '@/interfaces/models.interface';

export const AppContext = createContext({
  clientSync: async () => {},
  // filter is the list of model file names (model.filename)
  serverSync: async (type?: ModelType, filter?: string[]) => {},
  progress: undefined as ProgressEvent | undefined,
  update: async (id: number, newData: Model, immediate?: boolean) => false,
});
