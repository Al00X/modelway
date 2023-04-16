import { atom } from 'jotai';
import { Model, ModelExtended, ModelType } from '@/interfaces/models.interface';
import { MergeModelDetails, ModelPopulateComputedValues } from '@/helpers/model.helper';
import { KeyValue } from '@/interfaces/utils.interface';

type ModelsListType = { [p in ModelType]?: Model[] };

export class DataState {
  static rawList = atom<Model[]>([]);
  static processedList = atom<ModelExtended[]>((get) => {
    const models = get(DataState.rawList);

    const list = [];
    for (let i of models) {
      const model = MergeModelDetails(i);

      list.push(ModelPopulateComputedValues(model));
    }
    return list;
  });
  static processedListKeyed = atom<ModelsListType>((get) => {
    const models = get(DataState.rawList);
    const list: any = {};
    for (let i of models) {
      const newItem = MergeModelDetails(i);
      if ((list[newItem.metadata.type]?.length ?? 0) > 0) {
        list[newItem.metadata.type].push(newItem);
      } else {
        list[newItem.metadata.type] = [newItem];
      }
    }
    return list;
  });
  static availableTags = atom<string[]>((get) => {
    const models = get(DataState.rawList);
    return [
      ...new Set(
        models
          .reduce((pre, cur) => {
            pre = [...pre, ...(cur.metadata.tags ?? [])];
            return pre;
          }, [] as string[])
          .filter((x) => !!x && x !== ''),
      ),
    ].sort((a, b) => a.localeCompare(b));
  });
  static availableTagsKeyValue = atom<KeyValue<string>[]>((get) => {
    const tags = get(DataState.availableTags);
    return tags.map((x) => ({
      value: x,
      label: x,
    }));
  });
  static availableMerges = atom<string[]>((get) => {
    const models = get(DataState.rawList);
    return [
      ...new Set(
        models
          .reduce((pre, cur) => {
            pre = [...pre, ...(cur.metadata.currentVersion?.merges?.map(x => x === false ? '' : x.toLowerCase()) ?? [])];
            return pre;
          }, [] as string[])
          .filter((x) => !!x && x !== ''),
      ),
    ].sort((a, b) => a.localeCompare(b));
  });
  static availableMergesKeyValue = atom<KeyValue<string>[]>((get) => {
    const tags = get(DataState.availableMerges);
    return tags.map((x) => ({
      value: x,
      label: x,
    }));
  });
}
