import axios from 'axios';
import { Model } from '@/interfaces/models.interface';
import { CivitModel, CivitPaginatedResult } from '@/interfaces/api.interface';
import { getModelHash } from '@/services/scan';
import { modelFileNamePrune } from '@/helpers/model.helper';

const API_KEY = 'b09cd69cb0aceca9af532bc1af764bed';
const BASE_URL = 'https://civitai.com/api/v1/';

const http = axios.create({
  baseURL: BASE_URL,
});

export default async function apiCivitGetModel(model: Model) {
  if (!model.hash && !model.file) return;

  // null => 404, false => Try more!, result => Profit
  const search$ = async (query: string, page = 1): Promise<CivitModel | false | null> => {
    const result = await http.get<CivitPaginatedResult<CivitModel>>(`models?query=${query}&page=${page}`);

    if (result.data.items.length === 0) {
      console.error(model.file, 'Not found :(');

      return null;
    }
    if (result.data.items.length === 1) {
      console.log(model.file, 'Bingo!');

      return result.data.items[0];
    }
    let found = result.data.items.find((x) => x.modelVersions.find((y) => y.files.find((z) => z.name === model.file)));

    if (!found) {
      const name = modelFileNamePrune(model).toLowerCase();

      console.log(`With name?  ${name}`);
      found = result.data.items.find((x) => {
        const itemName = x.name.toLowerCase();
        const itemNamePruned = modelFileNamePrune(itemName);

        return itemName.includes(name) || itemName === name || itemNamePruned.includes(name) || itemNamePruned === name;
      });
    }
    if (!found && result.data.metadata.totalPages > 1 && page !== result.data.metadata.totalPages) {
      return search$(query, page + 1);
    }
    if (!found) {
      console.warn(model.file, 'Dalas kodom vari?, has ya nis?', result.data.metadata.totalItems);

      return false;
    }

    console.log(model.file, 'Found!');

    return found;
  };
  const get$ = async (id: number): Promise<CivitModel> => {
    const res = await http.get<CivitModel>(`models/${id}`);

    return res.data;
  };

  try {
    let result;

    if (model.metadata.originalValues?.id) {
      console.log(`Using id: ${modelFileNamePrune(model).toLowerCase()}`);
      result = await get$(model.metadata.originalValues.id);
    } else {
      result = await search$(model.hash);
    }

    if (result === false) {
      const fullHash = await getModelHash(model, 'sha256');
      const hashResult = await search$(fullHash);

      if (!hashResult) return null;

      return hashResult;
    }

    return result;
  } catch {
    return null;
  }
}
