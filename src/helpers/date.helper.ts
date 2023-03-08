export function DateToYYYY_MM_DD(date: Date) {
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  const year = date.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

export function DateToHH_MM_SS(date: Date) {
  let hours = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();
  return [hours, mins, secs].join(':');
}

export function DateFormatToDateTime(date: Date) {
  return DateToYYYY_MM_DD(date) + ' ' + DateToHH_MM_SS(date);
}
