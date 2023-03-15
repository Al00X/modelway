import { useAppContext } from '@/context/app.context';
import { useEffect, useRef, useState } from 'react';
import { Model, ModelType } from '@/interfaces/models.interface';
import Loader from '@/components/Loader/Loader';
import ModelCard from '@/components/ModelCard/ModelCard';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import Input from '@/components/Input/Input';
import Select from '@/components/Select/Select';
import { KeyValue } from '@/interfaces/utils.interface';
import Button, { ButtonClickEvent } from '@/components/Button/Button';
import { GlobalHotKeys } from 'react-hotkeys';
import {openToast} from "@/services/toast";

type SortType = 'alphabet' | 'merges';
type ViewType = 'grid' | 'list';
type SortDirection = 'asc' | 'desc';

const SortList: KeyValue<SortType>[] = [
  { text: 'Alphabet', value: 'alphabet' },
  { text: 'Merges Count', value: 'merges' },
];
const ViewList: KeyValue<ViewType>[] = [
  { text: 'Grid', value: 'grid', icon: 'grid' },
  { text: 'List', value: 'list', icon: 'list' },
];
const SortDirectionList: KeyValue<SortDirection>[] = [
  { text: 'Asc', value: 'asc', icon: 'asc' },
  { text: 'Desc', value: 'desc', icon: 'desc' },
];

export default function Browser() {
  const [category, setCategory] = useState<ModelType>('Checkpoint');
  const [sortType, setSortType] = useState<SortType>('alphabet');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [view, setView] = useState<ViewType>('grid');
  const [list, setList] = useState<Model[] | undefined>(undefined);
  const [rawList, setRawList] = useState<Model[] | undefined>(undefined);
  const [search, setSearch] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  const appContext = useAppContext();

  function prepareList() {
    let listToSet = [...(rawList ?? [])];
    if (!listToSet) {
      // setList(undefined);
      return;
    }
    if (search) {
      listToSet = listToSet.filter((x) => {
        for (let i of [x.file, x.hash, x.metadata.name]) {
          if (i?.toLowerCase()?.includes(search)) return true;
        }
      });
    }

    listToSet.sort((a, b) => {
      const first = sortDirection === 'asc' ? a : b;
      const last = sortDirection === 'asc' ? b : a;
      if (sortType === 'alphabet')
        return (first.metadata.name ?? first.file).localeCompare(last.metadata.name ?? last.file);
      else if (sortType === 'merges')
        return (first.metadata.currentVersion.merges?.filter((x) => x)?.length ?? 0) >
          (last.metadata.currentVersion.merges?.filter((x) => x)?.length ?? 0)
          ? 1
          : -1;
      return 1;
    });

    setList(listToSet);
  }

  async function runServerSync(e: ButtonClickEvent) {
    e.setLoading(true);
    const filter = list?.map((x) => x.file);
    appContext.serverSync(category, filter).then(() => {
      e.setLoading(false);
    });
  }

  function handleKeyBinds(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === 'F') {
      searchInputRef.current?.focus();
    }
  }

  useEffect(() => {
    setRawList(appContext.list[category] ?? []);
  }, [category, appContext.list]);

  useEffect(() => {
    prepareList();
  }, [search, sortType, sortDirection, rawList]);

  return (
    <div className={`flex flex-col h-full overflow-auto`}>
      <GlobalHotKeys keyMap={{ SEARCH: 'ctrl+f' }} handlers={{ SEARCH: () => searchInputRef.current?.focus() }} />

      <div
        className={`flex flex-wrap p-4 items-center bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-sm z-10 sticky top-0 w-full shadow-lg gap-x-12 gap-y-3 `}
      >
        <Input
          ref={searchInputRef}
          className={`w-full max-w-[20rem]`}
          placeholder={`Search...`}
          icon={`search`}
          value={search}
          onValue={(e) => setSearch(e)}
          clearable={true}
          debounce={200}
        />
        <div className={`flex items-center gap-3`}>
          <p className={`opacity-80`}>View :</p>
          <ButtonGroup items={ViewList} value={view} onValue={(e) => setView(e as any)} />
        </div>
        <div className={`flex items-center gap-3`}>
          <p className={`opacity-80`}>Sort :</p>
          <Select items={SortList} value={sortType} onValue={(e) => setSortType(e!)}>
            {(prop: any) => (
              <Input
                className={`w-full max-w-[20rem] cursor-pointer`}
                readonly={true}
                value={prop.selected.text}
                icon={`sort`}
              />
            )}
          </Select>
          <ButtonGroup items={SortDirectionList} value={sortDirection} onValue={(e) => setSortDirection(e as any)} />
        </div>
        <Button className={`ml-auto`} onClick={runServerSync}>
          SYNC
        </Button>
      </div>

      <div className={`w-full flex-auto gap-1 ${view === 'grid' ? 'flex flex-wrap px-2' : 'flex flex-col'}`}>
        {!list ? (
          <Loader />
        ) : (
          list.map((item, index) => (
            <ModelCard key={item.metadata.name + item.hash + item.file} item={item} wide={view === 'list'} onUpdate={() => {
              appContext.update(item.file, item).then(() => {
                openToast('Saved Successfully!');
              }).catch(() => {
                openToast('Saving model changes to the disk failed...');
              });
            }
            } />
          ))
        )}
      </div>

      <div
        className={`sticky bottom-0 w-full flex items-center pt-0.5 pb-1.5 px-3 text-xs bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg text-white`}
      >
        <span className={`ml-auto`}>Total: {rawList?.length ?? 0}</span>
      </div>
    </div>
  );
}
