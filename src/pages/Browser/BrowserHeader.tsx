import { GlobalHotKeys } from 'react-hotkeys';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { Menu } from '@mantine/core';
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
  { label: 'List', value: 'list', icon: 'list', hint: 'WIP' },
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

export type SyncModeTypes = 'category' | 'view' | 'all';

export interface BrowserHeaderChangeEvent extends FilterEngineInputs {
  viewMode: ViewType;
}

export interface BrowserHeaderSyncEvent {
  setLoading: (state: boolean) => void;
  mode?: SyncModeTypes;
  filename?: string;
}

const SEARCH_DEBOUNCE = 300; // in ms

export const BrowserHeader = (props: {
  onChange: (e: BrowserHeaderChangeEvent) => void;
  onSync: (e: BrowserHeaderSyncEvent) => void;
  onRefresh: (e: ButtonClickEvent) => void;
  onUpdate: (e: ButtonClickEvent) => void;
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
  const [isSyncing, setIsSyncing] = useState(false);

  const searchInputRef = useRef<InputElementType>(null);
  const filterTagSelectRef = useRef<SelectElementType>(null);
  const filterMergesSelectRef = useRef<SelectElementType>(null);

  const doSync = useCallback(
    (e: ButtonClickEvent, mode: SyncModeTypes) => {
      props.onSync({
        setLoading: (v) => {
          e.setLoading(v);
          setIsSyncing(v);
        },
        mode,
      });
    },
    [props.onSync],
  );

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
          debounce={SEARCH_DEBOUNCE}
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
        <div className={`ml-auto`}></div>
        <Button title={`Update models filesystem with .preview (thumbnail) and .info`} onClick={props.onUpdate}>
          UPDATE
        </Button>
        <Button title={`Refresh/Scan models from disk`} onClick={props.onRefresh}>
          REFRESH
        </Button>
        <Menu
          closeOnItemClick
          classNames={{ dropdown: `overflow-hidden rounded-lg bg-gray-800 text-base box-shadow border-gray-550 p-0` }}
        >
          <Menu.Target>
            <Button title={`Sync models with server (CivitAI)`} className={`bg-primary-700 hover:bg-primary-600`}>
              SYNC
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <div className={`flex flex-col gap-0.5 p-0.5 overflow-hidden rounded-xl`}>
              <Button
                title={`Sync models that are currently being filtered`}
                disabled={isSyncing}
                className={`bg-gray-600 hover:bg-gray-500 border-0 rounded-none`}
                onClick={(e) => {
                  doSync(e, 'view');
                }}
              >
                SYNC VIEW
              </Button>
              <Button
                title={`Sync all the models within the selected category`}
                disabled={isSyncing}
                className={`bg-gray-600 hover:bg-gray-500 border-0 rounded-none`}
                onClick={(e) => {
                  doSync(e, 'category');
                }}
              >
                SYNC CATEGORY
              </Button>
              <Button
                title={`Sync all the available categories`}
                disabled={isSyncing}
                className={`bg-gray-600 hover:bg-gray-500 border-0 rounded-none`}
                onClick={(e) => {
                  doSync(e, 'all');
                }}
              >
                SYNC ALL
              </Button>
            </div>
          </Menu.Dropdown>
        </Menu>
        {/*<Button*/}
        {/*  title={`Sync models with server (CivitAI)`}*/}
        {/*  className={`bg-primary-700 hover:bg-primary-600`}*/}
        {/*  onClick={props.onSync}*/}
        {/*>*/}
        {/*  SYNC*/}
        {/*</Button>*/}
      </div>
    </div>
  );
};
