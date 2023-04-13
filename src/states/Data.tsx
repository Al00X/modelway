import {atom} from "jotai";
import {Model, ModelExtended, ModelImage, ModelType} from "@/interfaces/models.interface";
import {MergeModelDetails} from "@/helpers/model.helper";

type ModelsListType = { [p in ModelType]?: Model[] };

export class DataState {
  static rawList = atom<Model[]>([]);
  static processedList = atom<ModelExtended[]>((get) => {
    const models = get(DataState.rawList);

    const list = [];
    for (let i of models) {
      const model = MergeModelDetails(i);

      const imagesArray: ModelImage[] = [];
      for (let i of [model.metadata.coverImage, ...(model.metadata.currentVersion.images?.slice(0, 3) ?? [])]) {
        if (!i) continue;
        imagesArray.push(i);
      }

      list.push({
        ...model,
        computed: {
          name:
            model.metadata.name ??
            model.file.substring(0, model.file.lastIndexOf('.')).replaceAll('_', ' ').replaceAll('-', ' '),
          keyImages: {
            single: imagesArray.length > 0 ? imagesArray[0] : null,
            double: imagesArray.length > 1 ? [imagesArray[0], imagesArray[1]] : imagesArray,
            triple: imagesArray,
          },
        }
      })
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
    return [...new Set(models.reduce((pre, cur) => {
      pre = [...pre, ...cur.metadata.tags ?? []];
      return pre;
    }, [] as string[]).filter(x => !!x))].sort((a, b) => a.localeCompare(b));
  });
}
