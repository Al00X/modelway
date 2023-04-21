import { GlobalHotKeys } from 'react-hotkeys';
import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import Input, { InputElementType } from '@/components/Input/Input';
import { Item } from '@/components/Item/Item';
import { ButtonGroup } from '@/components/ButtonGroup/ButtonGroup';
import Select, { SelectElementType } from '@/components/Select/Select';
import { Button, ButtonClickEvent } from '@/components/Button/Button';
import { KeyValue } from '@/interfaces/utils.interface';
import { SortDirection, SortType, TruncateViewType, ViewType } from '@/interfaces/app.interface';
import { SettingsState } from '@/states/Settings';
import { DataState } from '@/states/Data';
import { ModelType } from '@/interfaces/models.interface';
import { FilterEngineInputs } from '@/services/filter-engine';

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
const CategoryList: KeyValue<ModelType>[] = [
  { label: 'Checkpoints', value: 'Checkpoint' },
  { label: 'LORA', value: 'LORA' },
  { label: 'Hypernetworks', value: 'Hypernetwork' },
  { label: 'Embeddings', value: 'TextualInversion' },
];

export interface BrowserHeaderChangeEvent extends FilterEngineInputs {
  viewMode: ViewType;
}

export const BrowserHeader = (props: {
  onChange: (e: BrowserHeaderChangeEvent) => void;
  onSync: (e: ButtonClickEvent) => void;
  onRefresh: (e: ButtonClickEvent) => void;
}) => {
  const [atomAvailableTags] = useAtom(DataState.availableTagsKeyValue);
  const [atomAvailableMerges] = useAtom(DataState.availableMergesKeyValue);
  const [atomViewMode, setAtomViewMode] = useAtom(SettingsState.viewMode);
  const [atomTruncateViewMode, setAtomTruncateViewMode] = useAtom(SettingsState.truncateViewMode);
  const [atomSortMode, setAtomSortMode] = useAtom(SettingsState.sortMode);
  const [atomSortDirection, setAtomSortDirection] = useAtom(SettingsState.sortDirection);

  const [category, setCategory] = useState<ModelType>('Checkpoint');
  const [search, setSearch] = useState('');
  const [filterTags, setFilterTags] = useState<string[] | null>(null);
  const [filterMerges, setFilterMerges] = useState<string[] | null>(null);

  const searchInputRef = useRef<InputElementType>(null);
  const filterTagSelectRef = useRef<SelectElementType>(null);
  const filterMergesSelectRef = useRef<SelectElementType>(null);

  useEffect(() => {
    props.onChange({
      category,
      tags: filterTags ?? [],
      merges: filterMerges ?? [],
      search,
      sort: {
        key: atomSortMode,
        direction: atomSortDirection,
      },
      viewMode: atomViewMode,
      truncate: atomTruncateViewMode,
    });
  }, [
    search,
    atomSortMode,
    atomSortDirection,
    atomTruncateViewMode,
    filterTags,
    filterMerges,
    category,
    atomViewMode,
    props.onChange,
  ]);

  return (
    <div
      className={`flex p-4 items-center bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-sm z-10 sticky top-0 w-full shadow-lg gap-12`}
    >
      <GlobalHotKeys keyMap={{ search: 'ctrl+f' }} handlers={{ search: () => searchInputRef.current?.focus() }} />

      <div className={`flex flex-wrap items-center gap-x-12 gap-y-4 flex-auto`}>
        <Input
          clearable
          ref={searchInputRef}
          className={`w-full max-w-[20rem]`}
          placeholder={`Search...`}
          icon={`search`}
          value={search}
          debounce={200}
          onValue={(e) => {
            setSearch(e);
          }}
        />
        <Item label={`View`}>
          <ButtonGroup
            items={ViewList}
            value={atomViewMode}
            onValue={(e) => {
              setAtomViewMode(e as never);
            }}
          />
          <ButtonGroup
            className={`ml-2`}
            items={TruncateViewList}
            value={atomTruncateViewMode}
            onValue={(e) => {
              setAtomTruncateViewMode(e as never);
            }}
          />
        </Item>
        <Item label={`Sort`}>
          <Select
            items={SortList}
            value={[atomSortMode]}
            className={`w-full max-w-[20rem]`}
            icon={`sort`}
            onValue={(e) => {
              console.log(e, atomSortMode);
              setAtomSortMode(e![0]);
            }}
          ></Select>
          <ButtonGroup
            hideLabels
            className={`flex-none absolute right-0.5 bottom-0.5 w-20 top-0.5`}
            items={SortDirectionList}
            value={atomSortDirection}
            onValue={(e) => {
              setAtomSortDirection(e as never);
            }}
          />
        </Item>
        <Item label={`Filter`}>
          <Select
            multiple
            clearable
            multi
            ref={filterTagSelectRef}
            items={atomAvailableTags}
            cols={3}
            className={`w-full max-w-[20rem]`}
            placeholder={'Tags...'}
            value={filterTags}
            onValue={(e) => {
              setFilterTags(e);
            }}
          ></Select>
          <Select
            multiple
            clearable
            multi
            ref={filterMergesSelectRef}
            items={atomAvailableMerges}
            cols={2}
            className={`w-full max-w-[20rem]`}
            placeholder={'Merges...'}
            value={filterMerges}
            onValue={(e) => {
              setFilterMerges(e);
            }}
          ></Select>
          <Button
            onClick={() => {
              filterTagSelectRef.current?.clear();
              filterMergesSelectRef.current?.clear();
            }}
          >
            CLEAR
          </Button>
        </Item>
        <ButtonGroup
          className={`absolute right-4 bottom-4 text-sm`}
          value={category}
          items={CategoryList}
          onValue={(e) => {
            setCategory(e as any);
          }}
        />
      </div>
      <div className={`flex gap-3 flex-none h-10 self-baseline`}>
        <Button title={`Refresh models from disk`} className={`ml-auto`} onClick={props.onRefresh}>
          REFRESH
        </Button>
        <Button
          title={`Sync models with server (CivitAI)`}
          className={`bg-primary-700 hover:bg-primary-600`}
          onClick={props.onSync}
        >
          SYNC
        </Button>
      </div>
    </div>
  );
};
