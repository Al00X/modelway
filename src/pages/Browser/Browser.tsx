import { useAppContext } from '@/context/app.context';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ModelExtended, ModelType } from '@/interfaces/models.interface';
import Loader from '@/components/Loader/Loader';
import ModelCard from '@/components/ModelCard/ModelCard';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup';
import Input, {InputElementType} from '@/components/Input/Input';
import Select, {SelectElementType} from '@/components/Select/Select';
import { KeyValue } from '@/interfaces/utils.interface';
import Button, { ButtonClickEvent } from '@/components/Button/Button';
import { GlobalHotKeys } from 'react-hotkeys';
import { openToast } from '@/services/toast';
import { atom, useAtom, useAtomValue } from 'jotai';
import { DataState } from '@/states/Data';
import ModelDetailsDialog from '@/dialog/model-details-dialog/ModelDetailsDialog';
import { useForceUpdate } from '@mantine/hooks';
import Item from '@/components/Item/Item';
import {arrayHasAll, arrayHasAny} from "@/helpers/native.helper";

type SortType = 'alphabet' | 'merges';
type ViewType = 'grid' | 'list';
type SortDirection = 'asc' | 'desc';
type TruncateViewType = 'all' | 'recognized' | 'synced' | 'unknown';

const SortList: KeyValue<SortType>[] = [
  { label: 'Alphabet', value: 'alphabet' },
  { label: 'Merges Count', value: 'merges' },
];
const ViewList: KeyValue<ViewType>[] = [
  { label: 'Grid', value: 'grid', icon: 'grid' },
  { label: 'List', value: 'list', icon: 'list' },
];
const SortDirectionList: KeyValue<SortDirection>[] = [
  { label: 'Asc', value: 'asc', icon: 'asc', hint: 'Ascending' },
  { label: 'Desc', value: 'desc', icon: 'desc', hint: 'Descending' },
];
const TruncateViewList: KeyValue<TruncateViewType>[] = [
  { label: 'All', value: 'all', hint: 'All models' },
  { label: 'Recognized', value: 'recognized', hint: 'Models with available information' },
  { label: 'Synced', value: 'synced', hint: 'Models synced with online data' },
  { label: 'Unknown', value: 'unknown', hint: 'Models with unknown hash (Not synced)' },
];

export default function Browser() {
  const [category, setCategory] = useState<ModelType>('Checkpoint');
  const [sortType, setSortType] = useState<SortType>('alphabet');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [view, setView] = useState<ViewType>('grid');
  const [list, setList] = useState<ModelExtended[] | undefined>(undefined);
  const [itemToViewDetails, setItemToViewDetails] = useState<ModelExtended | undefined>(undefined);
  const [truncateView, setTruncateView] = useState<TruncateViewType>('recognized');
  const [search, setSearch] = useState('');
  const [filterTags, setFilterTags] = useState<string[] | null>(null);

  const [atomAvailableTags] = useAtom<KeyValue<string>[]>(
    useMemo(() => atom((get) => get(DataState.availableTags).map((x) => ({ label: x, value: x }))), []),
  );
  const atomList = useAtomValue(DataState.processedList);

  const searchInputRef = useRef<InputElementType>(null);
  const filterTagSelectRef = useRef<SelectElementType>(null);

  const appContext = useAppContext();
  const forceUpdate = useForceUpdate();

  const prepareList = useCallback(() => {
    if (atomList.length === 0) return;

    setList(undefined);
    setTimeout(() => {
      console.time('Prepare List');
      let listToSet = [...(atomList.filter((x) => x.metadata.type === category) ?? [])];
      if (!listToSet) {
        // setList(undefined);
        return;
      }

      if (truncateView !== 'all') {
        listToSet = listToSet.filter((x) =>
          truncateView === 'synced'
            ? !!x.metadata.id
            : truncateView === 'recognized'
            ? x.computed.recognized
            : !x.metadata.id,
        );
      }

      if (filterTags && filterTags.length > 0) {
        listToSet = listToSet.filter((x) => arrayHasAll(filterTags, x.metadata.tags ?? []))
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
        if (sortType === 'alphabet') return first.computed.name.localeCompare(last.computed.name);
        else if (sortType === 'merges')
          return (first.metadata.currentVersion.merges?.filter((x) => x)?.length ?? 0) >
            (last.metadata.currentVersion.merges?.filter((x) => x)?.length ?? 0)
            ? 1
            : -1;
        return 1;
      });
      console.timeEnd('Prepare List');
      setList(listToSet);
    }, 0);
  }, [atomList, category, sortType, sortDirection, search, truncateView, filterTags]);

  const runServerSync = useCallback(
    (e: ButtonClickEvent) => {
      e.setLoading(true);
      const filter = list?.map((x) => x.file);
      appContext.serverSync(category, filter).then(() => {
        e.setLoading(false);
      });
    },
    [list],
  );

  useEffect(() => {
    if (list === undefined && atomList.length > 0) {
      prepareList();
    }
  }, [atomList]);
  useEffect(() => {
    prepareList();
  }, [search, sortType, sortDirection, truncateView, filterTags]);

  return (
    <div className={`flex flex-col h-full overflow-auto`}>
      <GlobalHotKeys keyMap={{ SEARCH: 'ctrl+f' }} handlers={{ SEARCH: () => searchInputRef.current?.focus() }} />

      <div
        className={`flex p-4 items-center bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-sm z-10 sticky top-0 w-full shadow-lg gap-12`}
      >
        <div className={`flex flex-wrap items-center gap-x-12 gap-y-4 flex-auto`}>
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
          <Item label={`View`}>
            <ButtonGroup items={ViewList} value={view} onValue={(e) => setView(e as any)} />
            <ButtonGroup
              className={`ml-2`}
              items={TruncateViewList}
              value={truncateView}
              onValue={(e) => setTruncateView(e as any)}
            />
          </Item>
          <Item label={`Sort`}>
            <Select
              items={SortList}
              value={sortType}
              onValue={(e) => {
                setSortType(e![0]);
              }}
              className={`w-full max-w-[20rem]`}
              icon={`sort`}
            ></Select>
            <ButtonGroup
              className={`flex-none absolute right-0.5 bottom-0.5 w-20 top-0.5`}
              items={SortDirectionList}
              value={sortDirection}
              onValue={(e) => setSortDirection(e as any)}
              hideLabels={true}
            />
          </Item>
          <Item label={`Filter`}>
            <Select
              ref={filterTagSelectRef}
              items={atomAvailableTags}
              multiple={true}
              cols={3}
              className={`w-full max-w-[20rem]`}
              clearable={true}
              placeholder={'By tags...'}
              multi={true}
              onValue={(e) => {
                setFilterTags(e);
              }}
            ></Select>
            <Button onClick={() => filterTagSelectRef.current?.clear()}>CLEAR</Button>
          </Item>
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
              <ModelCard key={item.id} item={item} wide={view === 'list'} onClick={() => setItemToViewDetails(item)} />
            ))}
        </div>
      </div>

      <div
        className={`sticky bottom-0 w-full flex items-center pt-0.5 pb-1.5 px-3 text-xs bg-gray-900 bg-opacity-90 backdrop-filter backdrop-blur-lg text-white gap-8`}
      >
        <div className={`ml-auto`}>{/* SpaceLaces */}</div>
        <span className={``}>Filtered: {list?.length ?? 0}</span>
        <span className={``}>Total: {atomList?.length ?? 0}</span>
      </div>

      <ModelDetailsDialog
        item={itemToViewDetails}
        open={!!itemToViewDetails}
        onClose={() => setItemToViewDetails(undefined)}
        onSave={(newItem, close) => {
          const localSaveFn = () => {
            const index = list!.findIndex((x) => x.id === newItem.id);
            list![index] = newItem;
            forceUpdate();
          };
          const immediate = close === true;
          localSaveFn();

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
