export function Clone<T>(obj: T, except?: keyof T): T {
  const newObj = JSON.parse(JSON.stringify(obj));
  if (except) {
    delete newObj[except];
  }
  return newObj;
}
