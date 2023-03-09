import {useAppContext} from "@/context/app.context";
import {useEffect, useState} from "react";
import {Model, ModelType} from "@/interfaces/models.interface";
import Loader from "@/components/Loader/Loader";
import ModelCard from "@/components/ModelCard/ModelCard";

type SortType = 'A-Z' | 'Z-A';
type ViewType = 'grid' | 'table';

const SortList: SortType[] = ['A-Z', 'Z-A'];

export default function Browser() {
    const [category, setCategory] = useState<ModelType>('Checkpoint');
    const [sort, setSort] = useState<SortType>('A-Z');
    const [view, setView] = useState<ViewType>('grid');
    const [list, setList] = useState<Model[] | undefined>(undefined);
    const [rawList, setRawList] = useState<Model[] | undefined>(undefined);
    const appContext = useAppContext();

    function updateList(newList: Model[]) {
        setRawList(newList);
        prepareList();
    }
    function prepareList() {
        const listToSet = rawList;
        if (!listToSet) {
            // setList(undefined);
            return;
        }
        if (sort === 'A-Z') listToSet.sort((a, b) => (a.metadata.name ?? a.file).localeCompare(b.metadata.name ?? b.file));
        else if (sort === 'Z-A') listToSet.sort((a, b) => (b.metadata.name ?? b.file).localeCompare(a.metadata.name ?? a.file));

        setList(listToSet)
    }

    useEffect(() => {
        updateList(appContext.list[category] ?? []);
    }, [category, appContext.list]);

    return <>
        <div className={`w-full h-full gap-1 ${ view === 'grid' ? 'flex flex-wrap' : 'flex flex-col'}`}>
            {!list ? <Loader /> : list.map((item, index) => <ModelCard key={item.metadata.name + item.hash + item.file} item={item} wide={view === 'table'} />)}
        </div>
    </>
}
