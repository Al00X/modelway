import { useCallback, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useForceUpdate } from '@mantine/hooks';
import { BrowserHeader, BrowserHeaderChangeEvent } from './BrowserHeader';
import { useAppContext } from '@/context/App';
import { ModelExtended } from '@/interfaces/models.interface';
import { Loader } from '@/components/Loader/Loader';
import { ModelCard } from '@/components/ModelCard/ModelCard';
import { ButtonClickEvent } from '@/components/Button/Button';
import { openToast } from '@/services/toast';
import { DataState } from '@/states/Data';
import { ModelDetailsDialog } from '@/dialog/model-details-dialog/ModelDetailsDialog';
import { BrowserFooter } from '@/pages/Browser/BrowserFooter';
import { filterModelsList } from '@/services/filter-engine';

export const Browser = () => {
  const atomList = useAtomValue(DataState.processedList);

  const [list, setList] = useState<ModelExtended[] | undefined>();
  const [itemToViewDetails, setItemToViewDetails] = useState<ModelExtended | undefined>();
  const [filters, setFilters] = useState<BrowserHeaderChangeEvent | undefined>();

  const appContext = useAppContext();
  const forceUpdate = useForceUpdate();

  const prepareList = useCallback(() => {
    if (atomList.length === 0) return;

    setList(undefined);
    setTimeout(() => {
      console.time('Prepare List');
      const newList = filterModelsList(atomList, filters);

      if (!newList) return;
      console.timeEnd('Prepare List');
      setList(newList);
    }, 0);
  }, [atomList, filters]);

  const runServerSync = useCallback(
    (e: ButtonClickEvent) => {
      e.setLoading(true);
      const filter = list?.map((x) => x.file);

      appContext
        .serverSync(filters?.category, filter)
        .then(() => {
          e.setLoading(false);
        })
        .catch(() => {
          console.error('Server sync failed');
        });
    },
    [list, appContext, filters?.category],
  );

  useEffect(() => {
    if (list === undefined && atomList.length > 0) {
      prepareList();
    }
  }, [atomList, list, prepareList]);
  useEffect(() => {
    prepareList();
  }, [filters, prepareList]);

  return (
    <div className={`flex flex-col h-full overflow-auto`}>
      <BrowserHeader onChange={setFilters} onSync={runServerSync} />
      <div className={`w-full flex-auto relative`}>
        <Loader className={`transition-all top-40 fixed ${list ? 'opacity-0' : 'opacity-100'}`} />
        <div
          className={`transition-opacity w-full gap-1 ${
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
        onClose={() => {
          setItemToViewDetails(undefined);
        }}
        onSave={(newItem, close) => {
          const localSaveFn = () => {
            const index = list!.findIndex((x) => x.id === newItem.id);

            list![index] = newItem;
            forceUpdate();
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
            .catch(() => {
              openToast('Saving model changes to disk failed...');
            });
        }}
      />
    </div>
  );
};
