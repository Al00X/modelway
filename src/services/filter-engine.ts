import { ModelExtended, ModelType } from '@/interfaces/models.interface';
import { SortDirection, SortType, TruncateViewType } from '@/interfaces/app.interface';
import { arrayHasAll } from '@/helpers/native.helper';

export interface FilterEngineInputs {
  category?: ModelType;
  tags?: string[];
  merges?: string[];
  search?: string;
  sort?: {
    key: SortType;
    direction: SortDirection;
  };
  truncate?: TruncateViewType;
}

export function filterModelsList(
  list: ModelExtended[],
  filters: FilterEngineInputs | undefined,
): ModelExtended[] | null {
  let processedList = [...(list.filter((x) => x.metadata.type === filters?.category) ?? [])];

  if (!processedList) {
    // return [];
    return null;
  }

  if (filters) {
    if (filters.truncate !== 'all') {
      processedList = processedList.filter((x) =>
        filters.truncate === 'synced'
          ? !!x.metadata.id
          : filters.truncate === 'recognized'
          ? x.computed.recognized
          : !x.metadata.id,
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      processedList = processedList.filter((x) => arrayHasAll(filters.tags!, x.metadata.tags ?? [], true));
    }
    if (filters.merges && filters.merges.length > 0) {
      processedList = processedList.filter((x) =>
        arrayHasAll(filters.merges!, x.metadata.currentVersion.merges ?? [], true),
      );
    }

    if (filters.search) {
      processedList = processedList.filter((x) => {
        for (const i of [x.file, x.hash, x.metadata.name]) {
          if (i?.toLowerCase()?.includes(filters.search!)) return true;
        }

        return false;
      });
    }

    if (filters.sort) {
      processedList.sort((a, b) => {
        const first = filters.sort!.direction === 'asc' ? a : b;
        const last = filters.sort!.direction === 'asc' ? b : a;

        if (filters.sort!.key === 'alphabet') return first.computed.name.localeCompare(last.computed.name);
        if (filters.sort!.key === 'merges')
          return (first.metadata.currentVersion.merges?.filter((x) => x)?.length ?? 0) >
            (last.metadata.currentVersion.merges?.filter((x) => x)?.length ?? 0)
            ? 1
            : -1;

        return 1;
      });
    }
  }

  return processedList;
}
