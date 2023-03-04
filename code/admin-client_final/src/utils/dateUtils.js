export function formateDate(time) {
  if (!time) return ''
  let date = new Date(time)
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = (month >= 10) ? month : ('0' + month); //这些判断是为了显示05这种效果
  let day = date.getDate();
  day = (day >= 10) ? day : ('0' + day); //单纯为了美感，可以不加，也可以全加上。
  let hour = date.getHours();
  hour = (hour >= 10) ? hour : ('0' + hour)
  let minute = date.getMinutes();
  minute = (minute >= 10) ? minute : ('0' + minute);
  let second = date.getSeconds();
  second = (second >= 10) ? second : ('0' + second);
  let result = year + '-' + month + '-' + day + ' ' + hour + ': ' + minute + ': ' + second;
  return result;
}