// Clone an object using JSON serialize
export function clone<T>(obj: T, except?: keyof T): T {
  const newObj = JSON.parse(JSON.stringify(obj));

  if (except) {
    delete newObj[except];
  }

  return newObj as never;
}

/**
 * Use key to prevent duplicated items.
 *
 * @param key- Use to prevent duplicated items using object properties. The function finds duplicated items using 'equal ===' operation to check by default.
 */
export function mergeArray<T>(a: T[] | undefined, b: T[] | undefined, key?: keyof T) {
  const base = [...(a ?? [])];
  const toMerge = [...(b ?? [])];

  for (const i of toMerge) {
    if (key && base.some((x) => x[key] === i[key])) continue;
    else if (base.includes(i)) continue;
    base.push(i);
  }

  return base;
}

// similar to Array.findIndex function but returns a list of matched items indexes
export function findAllIndexes<T>(array: T[], predicate: (value: T, index: number) => boolean) {
  const indexes = [];

  for (const [i, element] of array.entries()) {
    if (predicate(element, i)) {
      indexes.push(i);
    }
  }

  return indexes;
}

// Check if a text includes any of the strings inside the given array
export function textIncludesArray(term: string, array: string[]) {
  if (term === '' || array.length === 0) return false;
  for (const i of array) {
    if (term.includes(i)) {
      return true;
    }
  }

  return false;
}

// Checks if the first array has any identical item inside the second array
export function arrayHasAny(term: string[], array: string[]) {
  if (term.length === 0 || array.length === 0) return false;
  for (const i of term) {
    if (array.includes(i)) return true;
  }

  return false;
}

// Checks if the first array has all the items inside the second array (is a subset)
export function arrayHasAll(term: string[], array: any[], ignoreCase?: boolean) {
  if (term.length === 0 || array.length === 0) return false;
  const transformedArray = ignoreCase ? array.map((x) => (typeof x === 'string' ? x.toLowerCase() : x)) : array;
  let pass = 0;

  for (const i of term) {
    if (transformedArray.includes(i)) {
      pass++;
    }
  }

  return pass === term.length;
}

// Arrays Equal...
export function arraysEqual<T>(a: T[], b: T[]) {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (a.length !== b.length) return false;

  for (const [i, element] of a.entries()) {
    if (element !== b[i]) return false;
  }

  return true;
}
