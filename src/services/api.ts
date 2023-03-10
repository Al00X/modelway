import { Model } from '@/interfaces/models.interface';
import axios from 'axios';
import { CivitModel, CivitPaginatedResult } from '@/interfaces/api.interface';
import { GetModelHash } from '@/services/scan';
import { ModelFileNamePrune } from '@/helpers/model.helper';

const API_KEY = 'b09cd69cb0aceca9af532bc1af764bed';
const BASE_URL = 'https://civitai.com/api/v1/';

const http = axios.create({
  baseURL: BASE_URL,
});

export default async function CivitGetModel(model: Model) {
  if (!model.hash && !model.file) return;

  // null => 404, false => Try more!, result => Profit
  const req$ = async (query: string, page = 1): Promise<CivitModel | false | null> => {
    const result = await http.get<CivitPaginatedResult<CivitModel>>(`models?query=${query}&page=${page}`);
    if (result.data.items.length === 0) {
      console.error(model.file, 'Not found :(');
      return null;
    } else if (result.data.items.length === 1) {
      console.log(model.file, 'Bingo!');
      return result.data.items[0];
    } else {
      let found = result.data.items.find((x) =>
        x.modelVersions.find((y) => y.files.find((z) => z.name === model.file)),
      );
      if (!found) {
        const name = ModelFileNamePrune(model).toLowerCase();
        console.log(`With name?  ${name}`);
        found = result.data.items.find(
          (x) => {
              const itemName = x.name.toLowerCase();
              const itemNamePruned = ModelFileNamePrune(itemName);

              return itemName.includes(name) ||
                  itemName === name ||
                  itemNamePruned.includes(name) ||
                  itemNamePruned === name
          } );
      }
      if (!found && result.data.metadata.totalPages > 1 && page <= 3) {
        return await req$(query, page + 1);
      }
      if (!found) {
        console.warn(model.file, 'Dalas kodom vari?, has ya nis?', result.data.metadata.totalItems);
        return false;
      }

      console.log(model.file, 'Found!');
      return found;
    }
  };

  const result = await req$(model.hash);
  if (result === false) {
    const fullHash = await GetModelHash(model, 'sha256');
    const hashResult = await req$(fullHash);
    if (!hashResult) return null;
    return hashResult;
  }
  return result;
}
