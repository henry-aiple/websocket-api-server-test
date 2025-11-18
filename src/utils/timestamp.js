import moment from 'moment-timezone';

export const toUnixTimestamp = (timestamp) => {
  if (timestamp instanceof Date) {
    return parseInt(((timestamp).getTime() / 1000).toFixed(0));
  } else if (typeof timestamp === 'string') {
    const parsedDate = new Date(timestamp);
    return parseInt(((parsedDate).getTime() / 1000).toFixed(0));
  } else {
    return null;
  }
};

export const toUnixMilliseconds = (timestamp) => {
  if (timestamp instanceof Date) {
    return parseInt(((timestamp).getTime()).toFixed(0));
  } else if (typeof timestamp === 'string') {
    const parsedDate = new Date(timestamp);
    return parseInt(((parsedDate).getTime()).toFixed(0));
  } else {
    return null;
  }
};

export const getCurrentUnixTimestamp = () =>
  parseInt((new Date().getTime() / 1000).toFixed(0));

export const getMonthsAfter = (myDate, months) => {
  const date = new Date(myDate);
  date.setMonth(date.getMonth() + months);
  return date;
};

export const getMonthsBefore = (myDate, months) => {
  const date = new Date(myDate);
  date.setMonth(date.getMonth() - months);
  return date;
};

export const getWeeksAfter = (myDate, weeks) =>
  new Date(myDate.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
export const getWeeksBefore = (myDate, weeks) =>
  new Date(myDate.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);

export const getDaysAfter = (myDate, days) =>
  new Date(myDate.getTime() + days * 24 * 60 * 60 * 1000);
export const getDaysBefore = (myDate, days) =>
  new Date(myDate.getTime() - days * 24 * 60 * 60 * 1000);

export const getHoursAfter = (myDate, hours) =>
  new Date(myDate.getTime() + hours * 60 * 60 * 1000);
export const getHoursBefore = (myDate, hours) =>
  new Date(myDate.getTime() - hours * 60 * 60 * 1000);

export const getMinutesAfter = (myDate, minutes) =>
  new Date(myDate.getTime() + minutes * 60 * 1000);
export const getMinutesBefore = (myDate, minutes) =>
  new Date(myDate.getTime() - minutes * 60 * 1000);

export const getSecondsAfter = (myDate, seconds) =>
  new Date(myDate.getTime() + seconds * 1000);
export const getSecondsBefore = (myDate, seconds) =>
  new Date(myDate.getTime() - seconds * 1000);

export const getElaspedTime = (fromTime, toTime = null) => {
  const endTime = toTime ? new Date(toTime) : new Date();
  let timeDiff = endTime - new Date(fromTime);
  // strip the ms
  timeDiff /= 1000;

  return timeDiff; // Math.round(timeDiff);
};

export const getNextDateByCycle = (cycle, unit, baseTs = new Date()) => {
  if (unit === 'DAY') {
    return getDaysAfter(baseTs, cycle);
  } else if (unit === 'MONTH') {
    const month = baseTs.getMonth();
    baseTs.setMonth(month + cycle);
    return baseTs;
  } else if (unit === 'YEAR') {
    const year = baseTs.getFullYear();
    baseTs.setFullYear(year + cycle);
    return baseTs;
  }
};

export const getTimeDiffInMinutes = (date1, date2) => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return (d1 - d2) / 60000;
  // return Math.round((d1 - d2) / 60000);
};

export const getTimeDiffInHours = (date1, date2) => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return (d1 - d2) / 3600000;
  // return Math.round((d1 - d2) / 3600000);
};

export const getTimeDiffInDays = (date1, date2) => {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return (d1 - d2) / (3600000 * 24);
};

export const getAge = (date) => {
  const today = new Date();
  let birthdate;

  if (date instanceof Date) {
    birthdate = date;
  } else if (typeof timestamp === 'string') {
    birthdate = new Date(date);
  } else {
    return null;
  }

  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
};

export const getZodiacSign = (birthdate) => {
  if (!(birthdate instanceof Date)) {
    throw new Error('not date object');
  }

  const month = birthdate.getMonth() + 1;
  const day = birthdate.getDate();

  const zodiac = [
    '',
    'capricorn',
    'aquarius',
    'pisces',
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
    'capricorn',
  ];

  const lastDay = ['', 19, 18, 20, 20, 21, 21, 22, 22, 21, 22, 21, 20, 19];
  return (day > lastDay[month]) ? zodiac[month * 1 + 1] : zodiac[month];
};

export const extractDate = (dateObj) => moment(dateObj)
  .format('YYYY-MM-DD');

export const extractTzDate = (timezone, dateObj) => moment(dateObj)
  .tz(timezone)
  .format('YYYY-MM-DD');

export const getTzDate = (timezone, YYYY, MM, DD, hh = '00', mm = '00', ss = '00') =>
  moment.tz(`${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`, timezone).toDate();

export const getTzDateByDateStr = (timezone, date, hh = '00', mm = '00', ss = '00') =>
  moment.tz(`${date} ${hh}:${mm}:${ss}`, timezone).toDate();

export const getTzDateByDateObj = (timezone, dateObj, hh = '00', mm = '00', ss = '00') =>
  moment.tz(`${extractTzDate(timezone, dateObj)} ${hh}:${mm}:${ss}`, timezone).toDate();

export const getUTCDate = (date = null) => moment((date ? new Date(date) : new Date()))
  .utc()
  .set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
  .toDate();

export const getUTCDateInUnix = (date = null) => moment((date ? new Date(date) : new Date()))
  .utc()
  .set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
  .unix();

export const getUTCDateInEpoch = (date = null) => moment((date ? new Date(date) : new Date()))
  .utc()
  .set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  })
  .valueOf();

export const convertTimezoneToOffset = (timezone) => moment.tz(timezone).format('Z');

export const addMinutesToTimeString = (timeStr, minutes) => {
  const [HH, mm, ss] = timeStr.split(':').map((x) => parseInt(x));
  const d = new Date(new Date().setHours(HH, mm + minutes, ss));
  return moment(d).format('HH:mm:ss');
  // return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

export const addHoursToTimeString = (timeStr, hours) => {
  const [HH, mm, ss] = timeStr.split(':').map((x) => parseInt(x));
  const d = new Date(new Date().setHours(HH, mm + (hours * 60), ss));
  return moment(d).format('HH:mm:ss');
};

export default {
  toUnixTimestamp,
  toUnixMilliseconds,
  getCurrentUnixTimestamp,
  getMonthsAfter,
  getMonthsBefore,
  getWeeksAfter,
  getWeeksBefore,
  getDaysAfter,
  getDaysBefore,
  getHoursAfter,
  getHoursBefore,
  getMinutesAfter,
  getMinutesBefore,
  getSecondsAfter,
  getSecondsBefore,
  getElaspedTime,
  getNextDateByCycle,
  getTimeDiffInMinutes,
  getTimeDiffInHours,
  getTimeDiffInDays,
  getAge,
  getZodiacSign,
  extractDate,
  extractTzDate,
  getTzDate,
  getTzDateByDateStr,
  getTzDateByDateObj,
  getUTCDate,
  getUTCDateInUnix,
  getUTCDateInEpoch,
  convertTimezoneToOffset,
  addMinutesToTimeString,
  addHoursToTimeString,
};
