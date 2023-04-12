import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { StorageGetModels, StorageSetModels } from '@/services/storage';
import { Model, ModelType } from '@/interfaces/models.interface';
import { GetModelHash, ScanModelDirectory } from '@/services/scan';
import Progress from '@/components/Progress/Progress';
import CivitGetModel from '@/services/api';
import {CivitModelToModel, MergeModelDetails} from '@/helpers/model.helper';
import Button from '@/components/Button/Button';
import {DataState} from "@/states/Data";
import {useAtom} from "jotai";
import {types} from "sass";
import String = types.String;

export interface ProgressEvent {
  current: number;
  total: number;
  message: string;
}

type ModelsListType = { [p in ModelType]?: Model[] };

const STORAGE_SAVE_DEBOUNCE_TIME = 10000;

const AppContext = createContext({
  list: {} as ModelsListType,
  clientSync: async () => {},
  // filter is the list of model file names (model.file)
  serverSync: async (type?: ModelType, filter?: string[]) => {},
  progress: undefined as ProgressEvent | undefined,
  update: async (id: number, newData: Model, immediate?: boolean) => false,
});

export const useAppContext = () => useContext(AppContext);

export function AppProvider(props: { children: any }) {
  const isSyncing = useRef<'client' | 'server' | undefined>(undefined);
  const cancelSyncing = useRef<boolean>(false);
  const rawList = useRef<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [list, _setList] = useState<ModelsListType>({});
  const [progress, setProgress] = useState<ProgressEvent | undefined>(undefined);
  const lastId = useRef(-1);

  const [atomAvailableTags, setAtomAvailableTags] = useAtom(DataState.availableTags);

  function setList(models: Model[]) {
    const list: any = {};
    for (let i of models) {
      const newItem = MergeModelDetails(i);
      if ((list[newItem.metadata.type]?.length ?? 0) > 0) {
        list[newItem.metadata.type].push(newItem);
      } else {
        list[newItem.metadata.type] = [newItem];
      }
    }
    _setList(list);

    // Post nonblocking operations after list update:
    setTimeout(async () => {
      setAtomAvailableTags([...new Set(models.reduce((pre, cur) => {
        pre = [...pre, ...cur.metadata.tags ?? []];
        return pre;
      }, [] as string[]).filter(x => !!x))].sort((a, b) => a.localeCompare(b)));
    }, 0);
  }

  function cancelSync() {
    cancelSyncing.current = true;
  }

  function shouldCancelSync() {
    let isCanceled = false;
    if (cancelSyncing.current) {
      isCanceled = true;
      console.log('Sync canceled...');
      cleanup();
    }
    return isCanceled;
  }

  function finalizeSyncing() {
    setList(rawList.current);
    console.log('Loaded:', rawList.current);
    cleanup();
  }

  function cleanup() {
    setProgress(undefined);
    setLoading(false);
    isSyncing.current = undefined;
    cancelSyncing.current = false;
  }

  async function serverSync(category?: ModelType, filter?: string[]) {
    if (isSyncing.current) {
      return;
    }

    isSyncing.current = 'server';
    setLoading(true);

    let counter = 0;
    let total = rawList.current.length;
    setProgress({
      current: counter,
      total: total,
      message: '',
    });

    for (let i = 0; i < total; i++) {
      if (shouldCancelSync()) return;
      counter++;
      const item = rawList.current[i];
      if ((filter ? !filter.includes(item.file) : false) || category ? item.metadata.type !== category : false)
        continue;
      setProgress({
        current: counter,
        total: total,
        message: `${item.metadata.type} - ${item.file}`,
      });
      if (filter ? !filter.includes(item.file) : false) continue;
      console.log(item);
      const result = await CivitGetModel(item);
      if (!result) continue;
      rawList.current[i] = await CivitModelToModel(result, item);
    }

    await StorageSetModels(rawList.current);

    finalizeSyncing();
  }

  async function clientSync() {
    if (isSyncing.current) {
      return;
    }

    isSyncing.current = 'client';
    setLoading(true);

    rawList.current = (await StorageGetModels()).models;
    setProgress({
      current: 0,
      total: 0,
      message: '',
    });

    lastId.current = rawList.current.reduce((pre, cur) => pre > cur.id ? pre : cur.id, -1) ?? -1;

    let i = 0;
    for (let type of ['Checkpoint']) {
      const scanned = await ScanModelDirectory(type as any);

      setProgress({
        current: 0,
        total: scanned.length,
        message: '',
      });
      for (let localModel of scanned) {
        if (shouldCancelSync()) return;

        setProgress({
          current: i,
          total: scanned.length,
          message: `${type} - ${localModel.name}`,
        });
        const matchedIndex = rawList.current.findIndex((x) => x.file === localModel.name);
        // console.log(`Hashing: ${localModel.name}`);
        const hash = await GetModelHash({ file: localModel.name, fullPath: localModel.path }, 'autoV1');
        if (matchedIndex !== -1 && rawList.current[matchedIndex].hash !== hash) {
          let item = rawList.current[matchedIndex];
          item = {
            ...item,
            hash: hash,
            fullPath: localModel.path,
            file: localModel.name,
          };

          if (!item.id) {
            lastId.current = lastId.current + 1;
            item.id = lastId.current;
          }
          rawList.current[matchedIndex] = item;
          // console.warn(`Hash of model ${localModel.name} updated, what should we do with it?`);
        } else if (matchedIndex === -1) {
          console.log(`New model added to the DB: ${localModel.name}`);
          lastId.current = lastId.current + 1;
          rawList.current.push({
            id: lastId.current,
            fullPath: localModel.path,
            file: localModel.name,
            hash: hash,
            metadata: { type: type as any, currentVersion: {} },
          });
        }

        i++;
      }
    }
    await StorageSetModels(rawList.current);

    finalizeSyncing();
  }

  async function update(id: number, model: Model, immediate?: boolean) {
    const index = rawList.current.findIndex(x => x.id === id);
    if (index === -1) {
      console.error('Where dafuq u got this id from?', id, model);
      return false;
    }
    rawList.current[index] = model;
    await queueStorageSave(immediate);
    return true;
  }

  const storageSaveTimeout = useRef<any>(null);
  function queueStorageSave(immediate?: boolean) {
    const saveFn = async () => (await StorageSetModels(rawList.current));
    storageSaveTimeout.current ? clearTimeout(storageSaveTimeout.current) : null;
    if (!immediate) {
      storageSaveTimeout.current = setTimeout(() => {
        saveFn();
      }, STORAGE_SAVE_DEBOUNCE_TIME);
    } else {
      return saveFn();
    }
  }

  useEffect(() => {
    clientSync();
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{ zIndex: 9999 }}
          className={`fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm flex flex-col items-center justify-center`}
        >
          {progress?.message ?? 'LOADING'}
          <Progress className={`mt-4`} current={progress?.current ?? 0} total={progress?.total ?? 1} />
          {isSyncing.current !== 'client' && (
            <Button className={`mt-6`} onClick={cancelSync}>
              Cancel
            </Button>
          )}
        </div>
      )}
      <AppContext.Provider
        value={{
          list: list,
          clientSync: () => clientSync(),
          serverSync: (type, filter) => serverSync(type, filter),
          progress: progress,
          update: (id, model, immediate) => update(id, model, immediate)
        }}
      >
        {props.children}
      </AppContext.Provider>
    </>
  );
}
