import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { storageGetModels, storageSetModels } from '@/services/storage';
import { Model, ModelType } from '@/interfaces/models.interface';
import { getModelHash, scanModelDirectory } from '@/services/scan';
import { Progress } from '@/components/Progress/Progress';
import apiCivitGetModel from '@/services/api';
import { civitModelToModel, modelsDeduplicate } from '@/helpers/model.helper';
import { Button } from '@/components/Button/Button';
import { DataState } from '@/states/Data';
import { AppContext } from '@/context/App/app.context';

export interface ProgressEvent {
  current: number;
  total: number;
  message: string;
}

const STORAGE_SAVE_DEBOUNCE_TIME = 10000;
const STARTUP_DELAY = 1;

export const AppProvider = (props: { children: any }) => {
  const isSyncing = useRef<'client' | 'server' | undefined>();
  const cancelSyncing = useRef<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressEvent | undefined>();

  const [atomRawList, setAtomRawList] = useAtom(DataState.rawList);
  const [render, setRender] = useState(false);

  function cancelSync() {
    cancelSyncing.current = true;
  }

  const shouldCancelSync = useCallback(() => {
    let canceled = false;

    if (cancelSyncing.current) {
      canceled = true;
      console.log('Sync canceled...');
      cleanup();
    }

    return canceled;
  }, []);

  const finalizeSyncing = useCallback(
    async (newList: Model[]) => {
      await storageSetModels(newList);
      setAtomRawList(newList);
      console.log('Loaded:', newList);
      cleanup();
    },
    [setAtomRawList],
  );

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

    const tempRawList = [...atomRawList];
    let counter = 0;
    const total = tempRawList.length;

    setProgress({
      current: counter,
      total,
      message: '',
    });

    for (let i = 0; i < total; i++) {
      if (shouldCancelSync()) return;
      counter++;
      const item = tempRawList[i];

      if ((filter ? !filter.includes(item.file) : false) || category ? item.metadata.type !== category : false)
        continue;
      setProgress({
        current: counter,
        total,
        message: `${item.metadata.type} - ${item.file}`,
      });
      if (filter ? !filter.includes(item.file) : false) continue;
      console.log(item);
      const result = await apiCivitGetModel(item);

      if (!result) continue;
      tempRawList[i] = civitModelToModel(result, item);
    }

    await finalizeSyncing(tempRawList);
  }

  const clientSync = useCallback(async () => {
    if (isSyncing.current) {
      return;
    }

    isSyncing.current = 'client';
    setLoading(true);

    const loadedList = (await storageGetModels()).models;

    setProgress({
      current: 0,
      total: 0,
      message: '',
    });

    let lastId = loadedList.reduce((pre, cur) => (pre > cur.id ? pre : cur.id), -1);

    const newSyncedList: Model[] = [];
    let i = 0;

    for (const type of ['Checkpoint']) {
      const scanned = await scanModelDirectory(type as any);
      const filteredList = loadedList.filter((x) => x.metadata.type === type);
      let entries = filteredList.map((x) => [x, scanned.find((y) => y.name === x.file)]);
      const newItems = scanned.filter((x) => filteredList.findIndex((y) => x.name === y.file) === -1);

      entries = [...entries, ...newItems.map((x) => [undefined, x])];

      setProgress({
        current: 0,
        total: entries.length,
        message: '',
      });
      for (const modelEntry of entries) {
        if (shouldCancelSync()) return;

        let fromStorage = modelEntry[0] as Model | undefined;
        const fromFile = modelEntry[1] as { name: string; path: string } | undefined;

        setProgress({
          current: i,
          total: entries.length,
          message: `${type} - ${fromStorage?.metadata.name ?? fromStorage?.file ?? fromFile?.name ?? ''}`,
        });

        let hash: string | undefined;

        if (fromFile) {
          hash = await getModelHash({ file: fromFile.name, fullPath: fromFile.path }, 'autoV1');
        }

        if (fromStorage) {
          if (!fromStorage.id) {
            lastId++;
            fromStorage.id = lastId;
          }

          if (fromFile && fromStorage.hash !== hash) {
            fromStorage.hash = hash!;
            fromStorage.fullPath = fromFile.path;
            fromStorage.file = fromFile.name;
          }
        } else if (fromFile) {
          console.log(`New model added to the DB: ${fromFile.name}`);
          lastId++;
          fromStorage = {
            id: lastId,
            fullPath: fromFile.path,
            file: fromFile.name,
            hash: hash!,
            metadata: { type: type as any, currentVersion: {} },
          };
        }

        newSyncedList.push(fromStorage!);

        i++;
      }
    }
    console.log(modelsDeduplicate(newSyncedList));

    await finalizeSyncing(newSyncedList);
  }, [finalizeSyncing, shouldCancelSync]);

  async function update(id: number, model: Model, immediate?: boolean) {
    const index = atomRawList.findIndex((x) => x.id === id);

    if (index === -1) {
      console.error('Where dafuq u got this id from?', id, model);

      return false;
    }
    // TODO: Performance wise, this is fucked up...
    const newList = [...atomRawList];

    newList[index] = model;
    setAtomRawList(newList);
    await queueStorageSave(newList, immediate);

    return true;
  }

  const storageSaveTimeout = useRef<any>(null);

  function queueStorageSave(list: Model[], immediate?: boolean) {
    const saveFn = async () => {
      await storageSetModels(list);
    };

    storageSaveTimeout.current ? clearTimeout(storageSaveTimeout.current) : null;
    if (!immediate) {
      storageSaveTimeout.current = setTimeout(() => {
        saveFn().catch(() => {
          console.error('Storage Save Error');
        });
      }, STORAGE_SAVE_DEBOUNCE_TIME);
    } else {
      return saveFn();
    }
  }

  useEffect(() => {
    clientSync().catch(() => {
      console.error('Client Sync Error');
    });
    setTimeout(() => {
      setRender(true);
    }, STARTUP_DELAY);
  }, [clientSync]);

  return (
    <>
      {!!loading && (
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
          clientSync: () => clientSync(),
          serverSync: (type, filter) => serverSync(type, filter),
          progress,
          update: (id, model, immediate) => update(id, model, immediate),
        }}
      >
        {render ? props.children : null}
      </AppContext.Provider>
    </>
  );
};