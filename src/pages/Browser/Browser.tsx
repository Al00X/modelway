import { useAppContext } from '@/context/app.context';
import { useEffect, useState } from 'react';
import { Model, ModelType } from '@/interfaces/models.interface';
import Loader from '@/components/Loader/Loader';
import ModelCard from '@/components/ModelCard/ModelCard';
import Icon from '@/components/Icon/Icon';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import Input from "@/components/Input/Input";

type SortType = 'A-Z' | 'Z-A';
type ViewType = 'grid' | 'list';

const SortList: SortType[] = ['A-Z', 'Z-A'];

export default function Browser() {
  const [category, setCategory] = useState<ModelType>('Checkpoint');
  const [sort, setSort] = useState<SortType>('A-Z');
  const [view, setView] = useState<ViewType>('grid');
  const [list, setList] = useState<Model[] | undefined>(undefined);
  const [rawList, setRawList] = useState<Model[] | undefined>(undefined);
  const [search, setSearch] = useState('');
  const appContext = useAppContext();

  function updateList(newList: Model[]) {
    setRawList(newList);
    prepareList();
  }
  function prepareList() {
    let listToSet = rawList;
    if (!listToSet) {
      // setList(undefined);
      return;
    }
    if (search) {
      listToSet = listToSet.filter(x => {
        for(let i of [x.file, x.hash, x.metadata.name]) {
          if (i?.includes(search)) return true;
        }
      })
    }

    if (sort === 'A-Z') listToSet.sort((a, b) => (a.metadata.name ?? a.file).localeCompare(b.metadata.name ?? b.file));
    else if (sort === 'Z-A')
      listToSet.sort((a, b) => (b.metadata.name ?? b.file).localeCompare(a.metadata.name ?? a.file));

    setList(listToSet);
  }

  useEffect(() => {
    updateList(appContext.list[category] ?? []);
  }, [category, appContext.list]);

  useEffect(() => {
    prepareList();
  }, [search])

  return (
    <>
      <div className={`flex p-4 items-center bg-gray-700 bg-opacity-90 backdrop-filter backdrop-blur-sm z-10 sticky top-0 shadow-lg gap-12`}>
        <Input className={`w-full max-w-[20rem]`} placeholder={`Search...`} icon={`search`} value={search} onValue={(e) => setSearch(e)} clearable={true} debounce={200} />
        <ButtonGroup
          items={[
            { text: 'Grid', value: 'grid', icon: 'grid' },
            { text: 'List', value: 'list', icon: 'list' },
          ]}
          value={view}
          onValue={(e) => setView(e as any)}
        />
      </div>
      <div className={`w-full h-full gap-1 ${view === 'grid' ? 'flex flex-wrap' : 'flex flex-col'}`}>
        {!list ? (
          <Loader />
        ) : (
          list.map((item, index) => (
            <ModelCard key={item.metadata.name + item.hash + item.file} item={item} wide={view === 'list'} />
          ))
        )}
      </div>
    </>
  );
}
