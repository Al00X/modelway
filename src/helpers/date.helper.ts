// eslint-disable-next-line @typescript-eslint/naming-convention
export function dateToYYYY_MM_DD(date: Date) {
  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;
  const year = date.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function dateToHH_MM_SS(date: Date) {
  const hours = date.getHours();
  const mins = date.getMinutes();
  const secs = date.getSeconds();

  return [hours, mins, secs].join(':');
}

export function dateFormatToDateTime(date: Date) {
  return `${dateToYYYY_MM_DD(date)} ${dateToHH_MM_SS(date)}`;
}
