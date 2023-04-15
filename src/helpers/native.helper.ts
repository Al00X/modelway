// Clone an object using JSON serialize
export function Clone<T>(obj: T, except?: keyof T): T {
  const newObj = JSON.parse(JSON.stringify(obj));
  if (except) {
    delete newObj[except];
  }
  return newObj;
}

/**
 * use key to prevent duplicated items
 * @param key use to prevent duplicated items using object properties. The function finds duplicated items using 'equal ===' operation to check by default
 */
export function mergeArray<T>(a: T[] | undefined, b: T[] | undefined, key?: keyof T) {
  const base = [...(a ?? [])];
  const toMerge = [...(b ?? [])];
  for (const i of toMerge) {
    if (key && base.find((x) => x[key] === i[key])) continue;
    else if (base.includes(i)) continue;
    base.push(i);
  }
  return base;
}

// similar to Array.findIndex function but returns a list of matched items indexes
export function findAllIndexes<T>(array: T[], predicate: (value: T, index: number) => boolean) {
  const indexes = [];
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i)) {
      indexes.push(i);
    }
  }
  return indexes;
}

// Check if a text includes any of the strings inside the given array
export function textIncludesArray(term: string, array: string[]) {
  if (term === '' || array.length === 0) return false;
  for(let i of array) {
    if (term.includes(i)) {
      return true;
    }
  }
  return false;
}

// Checks if the first array has any identical item inside the second array
export function arrayHasAny(term: string[], array: string[]) {
  if (term.length === 0 || array.length === 0) return false;
  for(let i of term) {
    if (array.includes(i)) return true;
  }
  return false;
}

// Checks if the first array has all the items inside the second array (is a subset)
export function arrayHasAll(term: string[], array: string[]) {
  if (term.length === 0 || array.length === 0) return false;
  let pass = 0;
  for(let i of term) {
    if (array.includes(i)) {
      pass++;
    }
  }
  return pass === term.length;
}
