import {createContext, useContext, useEffect, useRef, useState} from 'react';
import { StorageGetModels, StorageSetModels } from '@/services/storage';
import { Model, ModelType } from '@/interfaces/models.interface';
import { GetModelHash, ScanModelDirectory } from '@/services/scan';
import Progress from "@/components/Progress/Progress";

const AppContext = createContext({
  list: {} as { [p in ModelType]: Model[] },
});

export const useAppContext = () => useContext(AppContext);

export function AppProvider(props: { children: any }) {
  const isSyncing = useRef(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState({});
  const [progress, setProgress] = useState<{
    current: number,
    total: number,
    message: string,
  } | undefined>(undefined);

  async function serverSync() {}

  async function clientSync() {
    if (isSyncing.current) {
      return;
    }

    isSyncing.current = true;
    setLoading(true);

    const allModels = (await StorageGetModels()).models;
    setProgress({
      current: 0,
      total: 0,
      message: '',
    });

    let i = 0;
    for (let type of ['Checkpoint']) {
      const scanned = await ScanModelDirectory(type as any);

      setProgress({
        current: 0,
        total: scanned.length,
        message: '',
      });
      for (let localModel of scanned) {
        setProgress({
          current: i,
          total: scanned.length,
          message: `${type} - ${localModel.name}`,
        })
        const matchedIndex = allModels.findIndex((x) => x.file === localModel.name);
        // console.log(`Hashing: ${localModel.name}`);
        const hash = await GetModelHash({ file: localModel.name, fullPath: localModel.path }, 'autoV1');
        if (matchedIndex !== -1 && allModels[matchedIndex].hash !== hash) {
          allModels[matchedIndex] = {
            ...allModels[matchedIndex],
            hash: hash,
            fullPath: localModel.path,
            file: localModel.name,
          };
          // console.warn(`Hash of model ${localModel.name} updated, what should we do with it?`);
        } else if (matchedIndex === -1) {
          allModels.push({
            fullPath: localModel.path,
            file: localModel.name,
            hash: hash,
            metadata: { type: type as any, currentVersion: {} },
          });
        }

        i++;
      }
    }
    await StorageSetModels(allModels);

    const list: any = {};
    for (let i of allModels) {
      if ((list[i.metadata.type]?.length ?? 0) > 0) {
        list[i.metadata.type].push(i);
      } else {
        list[i.metadata.type] = [i];
      }
    }

    setList(list);
    console.log('Loaded:', list);
    setProgress(undefined);
    setLoading(false);
    isSyncing.current = false;
  }

  useEffect(() => {
    clientSync();
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{zIndex: 9999}}
          className={`fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm flex flex-col items-center justify-center`}
        >
          { progress?.message ?? 'LOADING' }
          <Progress className={`mt-4`} current={progress?.current ?? 0} total={progress?.total ?? 1} />
        </div>
      )}
      <AppContext.Provider value={{ list: list }}>{props.children}</AppContext.Provider>
    </>
  );
}
