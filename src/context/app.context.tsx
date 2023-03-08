import {createContext, useContext, useEffect, useState} from 'react';
import {SyncAllModels} from "@/services/scan";
import Loader from "@/components/Loader/Loader";
import {StorageGetModels} from "@/services/storage";
import {Model, ModelType} from "@/interfaces/models.interface";

const AppContext = createContext({
  list: {} as {[p in ModelType]: Model[]},
});

export const useAppContext = () => useContext(AppContext);

export function AppProvider(props: { children: any }) {
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState({});
    useEffect(() => {
        const fn = async () => {
            await SyncAllModels();
            const modelStorage = await StorageGetModels();
            const list: any = {};
            for(let i of modelStorage.models) {
                if ((list[i.metadata.type]?.length ?? 0) > 0) {
                    list[i.metadata.type].push(i);
                } else {
                    list[i.metadata.type] = [i];
                }
            }
            setList(list);
            setLoading(false);
        }
        fn();
    }, []);
  return <AppContext.Provider value={{ list: list }}>{loading ? <Loader /> : props.children}</AppContext.Provider>;
}
