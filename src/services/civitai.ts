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

// null => 404, false => Try more!, result => Profit
async function apiCivitSearchWithModel(model: Model, query: string, page = 1): Promise<CivitModel | false | null> {
  const result = await http.get<CivitPaginatedResult<CivitModel>>(`models?query=${query}&page=${page}`);

  if (result.data.items.length === 0) {
    console.error(model.filename, 'Not found :(');

    return null;
  }
  if (result.data.items.length === 1) {
    console.log(model.filename, 'Bingo!');

    return result.data.items[0];
  }
  let found = result.data.items.find((x) =>
    x.modelVersions.find((y) => y.files.find((z) => z.name === model.filename)),
  );

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
    return apiCivitSearchWithModel(model, query, page + 1);
  }
  if (!found) {
    console.warn(model.filename, 'Dalas kodom vari?, has ya nis?', result.data.metadata.totalItems);

    return false;
  }

  console.log(model.filename, 'Found!');

  return found;
}

async function apiCivitGetById(id: number): Promise<CivitModel> {
  const res = await http.get<CivitModel>(`models/${id}`);

  return res.data;
}

export default async function apiCivitGetModel(model: Model) {
  if (!model.hash && !model.filename) return;

  try {
    let result;

    if (model.metadata.originalValues?.id) {
      console.log(`Using id: ${modelFileNamePrune(model).toLowerCase()}`);
      result = await apiCivitGetById(model.metadata.originalValues.id);
    } else {
      result = await apiCivitSearchWithModel(model, model.hash);
    }

    if (result === false) {
      const blake3 = await getModelHash(model, 'blake3');
      const blakeHashResult = await apiCivitSearchWithModel(model, blake3);

      if (blakeHashResult) return blakeHashResult;

      const sha256 = await getModelHash(model, 'sha256');
      const sha256HashResult = await apiCivitSearchWithModel(model, sha256);

      if (sha256HashResult) return sha256HashResult;

      return null;
    }

    return result;
  } catch {
    return null;
  }
}
