import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { BrowserHeader, BrowserHeaderChangeEvent, BrowserHeaderRef, BrowserHeaderSyncEvent } from './BrowserHeader';
import { useAppContext } from '@/context/App';
import { ModelExtended } from '@/interfaces/models.interface';
import { Loader } from '@/components/Loader/Loader';
import { ModelCard } from '@/components/ModelCard/ModelCard';
import { openToast } from '@/services/toast';
import { DataState } from '@/states/Data';
import { ModelDetailsDialog } from '@/dialog/model-details-dialog/ModelDetailsDialog';
import { BrowserFooter } from '@/pages/Browser/BrowserFooter';
import { filterModelsList } from '@/services/filter-engine';
import { ButtonClickEvent } from '@/components/Button/Button';
import { modelPopulateComputedValues } from '@/helpers/model.helper';
import { useEvent } from '@/hooks/useEvent';
import { HotKeySearchEvent } from '@/context/HotKeys.provider';

export const Browser = () => {
  const atomList = useAtomValue(DataState.processedList);

  const [list, setList] = useState<ModelExtended[] | undefined>();
  const [itemToViewDetails, setItemToViewDetails] = useState<ModelExtended | undefined>();
  const [filters, setFilters] = useState<BrowserHeaderChangeEvent | undefined>();

  const appContext = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<BrowserHeaderRef>(null);
  const [triggerListUpdate, setTriggerListUpdate] = useState(false);

  useEvent(HotKeySearchEvent, () => {
    headerRef.current?.getSearchInputRef()?.focus();
  });

  const prepareList = useCallback(() => {
    setList(undefined);
    setTimeout(() => {
      console.time('Prepare List');

      const newList = atomList.length === 0 ? [] : filterModelsList(atomList, filters);

      if (!newList) return;
      console.timeEnd('Prepare List');
      setList(newList);
      setTriggerListUpdate(false);
    }, 0);
  }, [atomList, filters]);

  const runServerSync = useCallback(
    (e: BrowserHeaderSyncEvent) => {
      e.setLoading(true);

      let filter: string[] | undefined;
      let category = filters?.category;

      if (e.filename) {
        filter = [e.filename];
      } else if (e.mode === 'view') {
        filter = list?.map((x) => x.filename);
      } else if (e.mode === 'category') {
        filter = undefined;
      } else {
        // e.mode === 'all'
        category = undefined;
        filter = undefined;
      }

      appContext
        .serverSync(category, filter)
        .then(() => {
          openToast('Synced!');
          e.setLoading(false);
          setTriggerListUpdate(true);
        })
        .catch((error) => {
          e.setLoading(false);
          if (error === undefined) return;
          console.error('Server sync failed', error);
          openToast('Synced Failed :(');
        });
    },
    [list, appContext, filters?.category],
  );

  const runClientSync = useCallback(
    (e: ButtonClickEvent) => {
      e.setLoading(true);

      appContext
        .clientSync()
        .then(() => {
          openToast('Refreshed!');
          e.setLoading(false);
          setTriggerListUpdate(true);
        })
        .catch((error) => {
          e.setLoading(false);
          if (error === undefined) return;
          console.error('Disk refresh failed', error);
          openToast('Refresh Failed :(');
        });
    },
    [appContext],
  );

  const runClientUpdate = useCallback(
    (e: ButtonClickEvent) => {
      e.setLoading(true);
      appContext
        .clientUpdate()
        .then(() => {
          openToast('Updated!');
          e.setLoading(false);
        })
        .catch((error) => {
          e.setLoading(false);
          if (error === undefined) return;
          console.error('Update failed', error);
          openToast('Update Failed :(');
        });
    },
    [appContext],
  );

  useEffect(() => {
    if (triggerListUpdate || ((list === undefined || list.length === 0) && atomList.length > 0)) {
      prepareList();
    }
  }, [atomList, triggerListUpdate]);
  useEffect(() => {
    if (list && itemToViewDetails) {
      setItemToViewDetails(atomList.find((x) => x.id === itemToViewDetails.id));
    }
  }, [list]);
  useEffect(() => {
    prepareList();
  }, [filters]);

  return (
    <div ref={containerRef} className={`flex flex-col h-full overflow-auto`}>
      <BrowserHeader
        ref={headerRef}
        onChange={setFilters}
        onSync={runServerSync}
        onRefresh={runClientSync}
        onUpdate={runClientUpdate}
      />
      <div className={`w-full flex-auto relative`}>
        {!list && <Loader className={`transition-all mx-auto ${list ? 'opacity-0' : 'opacity-100'}`} />}
        <div
          className={`transition-opacity w-full gap-2 ${
            filters?.viewMode === 'grid' ? 'flex flex-wrap px-2' : 'flex flex-col'
          } ${list ? 'opacity-100' : 'opacity-0'}`}
        >
          {!!list &&
            list.map((item) => (
              <ModelCard
                key={item.id}
                item={item}
                wide={filters?.viewMode === 'list'}
                onClick={() => {
                  setItemToViewDetails(item);
                }}
              />
            ))}
        </div>
      </div>

      <BrowserFooter filteredListLength={list?.length} />

      <ModelDetailsDialog
        item={itemToViewDetails}
        open={!!itemToViewDetails}
        onSync={(e, filename) => {
          runServerSync({ setLoading: e.setLoading, filename });
        }}
        onClose={() => {
          setItemToViewDetails(undefined);
        }}
        onSave={(newItem, close) => {
          const localSaveFn = () => {
            // TODO: Wave for the performance
            const newList = [...(list ?? [])];
            const index = newList.findIndex((x) => x.id === newItem.id);

            newList[index] = modelPopulateComputedValues(newItem);
            setList(newList);
          };
          const immediate = close;

          localSaveFn();

          appContext
            .update(newItem.id, newItem, immediate)
            .then(() => {
              if (immediate) {
                openToast('Saved Successfully!');
              }
            })
            .catch((e) => {
              console.error('Saving model changes to disk failed', e);
              openToast('Saving model changes to disk failed...');
            });
        }}
      />
    </div>
  );
};
