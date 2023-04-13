import { useAppContext } from '@/context/app.context';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ModelExtended, ModelType } from '@/interfaces/models.interface';
import Loader from '@/components/Loader/Loader';
import ModelCard from '@/components/ModelCard/ModelCard';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import Input from '@/components/Input/Input';
import Select from '@/components/Select/Select';
import { KeyValue } from '@/interfaces/utils.interface';
import Button, { ButtonClickEvent } from '@/components/Button/Button';
import { GlobalHotKeys } from 'react-hotkeys';
import { openToast } from '@/services/toast';
import {atom, useAtom, useAtomValue} from 'jotai';
import { DataState } from '@/states/Data';
import ModelDetailsDialog from '@/dialog/model-details-dialog/ModelDetailsDialog';

type SortType = 'alphabet' | 'merges';
type ViewType = 'grid' | 'list';
type SortDirection = 'asc' | 'desc';

const SortList: KeyValue<SortType>[] = [
  { label: 'Alphabet', value: 'alphabet' },
  { label: 'Merges Count', value: 'merges' },
];
const ViewList: KeyValue<ViewType>[] = [
  { label: 'Grid', value: 'grid', icon: 'grid' },
  { label: 'List', value: 'list', icon: 'list' },
];
const SortDirectionList: KeyValue<SortDirection>[] = [
  { label: 'Asc', value: 'asc', icon: 'asc' },
  { label: 'Desc', value: 'desc', icon: 'desc' },
];

export default function Browser() {
  const [category, setCategory] = useState<ModelType>('Checkpoint');
  const [sortType, setSortType] = useState<SortType>('alphabet');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [view, setView] = useState<ViewType>('grid');
  const [list, setList] = useState<ModelExtended[] | undefined>(undefined);
  const [itemToViewDetails, setItemToViewDetails] = useState<ModelExtended | undefined>(undefined);
  const [search, setSearch] = useState('');

  const [atomAvailableTags] = useAtom<KeyValue<string>[]>(
    useMemo(() => atom((get) => get(DataState.availableTags).map((x) => ({ label: x, value: x }))), []),
  );
  const atomList = useAtomValue(DataState.processedList);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const appContext = useAppContext();

  function prepareList() {
    setList(undefined);
    setTimeout(() => {
      let listToSet = [...(atomList.filter(x => x.metadata.type === category) ?? [])];
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
    }, 0);
  }

  async function runServerSync(e: ButtonClickEvent) {
    e.setLoading(true);
    const filter = list?.map((x) => x.file);
    appContext.serverSync(category, filter).then(() => {
      e.setLoading(false);
    });
  }

  useEffect(() => {
    prepareList();
  }, [search, sortType, sortDirection, atomList]);

  return (
    <div className={`flex flex-col h-full overflow-auto`}>
      <GlobalHotKeys keyMap={{ SEARCH: 'ctrl+f' }} handlers={{ SEARCH: () => searchInputRef.current?.focus() }} />

      <div
        className={`flex p-4 items-center bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-sm z-10 sticky top-0 w-full shadow-lg gap-12`}
      >
        <div className={`flex flex-wrap items-center gap-x-12 gap-y-3 flex-auto`}>
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
            <p className={`opacity-80 flex-none`}>Sort :</p>
            <Select
              items={SortList}
              value={sortType}
              onValue={(e) => {
                setSortType(e!);
              }}
              className={`w-full max-w-[20rem]`}
              icon={`sort`}
            ></Select>
            <ButtonGroup
              className={`flex-none`}
              items={SortDirectionList}
              value={sortDirection}
              onValue={(e) => setSortDirection(e as any)}
            />
          </div>
          <div className={`flex items-center gap-3`}>
            <p className={`opacity-80 flex-none`}>Filter :</p>
            <Select
              items={atomAvailableTags}
              multiple={true}
              cols={3}
              className={`w-full max-w-[20rem]`}
              clearable={true}
              placeholder={'By tags...'}
            ></Select>
          </div>
        </div>
        <div className={`flex flex-col flex-none h-full`}>
          <Button className={`ml-auto`} onClick={runServerSync}>
            SYNC
          </Button>
        </div>
      </div>

      <div className={`w-full flex-auto relative`}>
        <Loader className={`transition-all top-40 fixed ${list ? 'opacity-0' : 'opacity-100'}`} />
        <div
          className={`transition-opacity w-full gap-1 ${view === 'grid' ? 'flex flex-wrap px-2' : 'flex flex-col'} ${
            list ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {list &&
            list.map((item, index) => (
              <ModelCard
                key={item.id}
                item={item}
                wide={view === 'list'}
                onClick={() => setItemToViewDetails(item)}
              />
            ))}
        </div>
      </div>

      <div
        className={`sticky bottom-0 w-full flex items-center pt-0.5 pb-1.5 px-3 text-xs bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg text-white`}
      >
        <span className={`ml-auto`}>Total: {atomList?.length ?? 0}</span>
      </div>

      <ModelDetailsDialog
        item={itemToViewDetails}
        open={!!itemToViewDetails}
        onClose={() => setItemToViewDetails(undefined)}
        onSave={(newItem, close) => {
          const immediate = close === true;
          appContext
            .update(newItem.id, newItem, immediate)
            .then(() => {
              if (immediate) {
                openToast('Saved Successfully!');
              }
            })
            .catch(() => {
              openToast('Saving model changes to disk failed...');
            });
        }}
      />
    </div>
  );
}
