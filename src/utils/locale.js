export const parseLocale = (locale) => {
  // eslint-disable-next-line no-useless-escape
  const [lang, loc] = locale.split(/\_(?=[^\_]+$)/);
  return {
    lang: lang ? lang : null,
    loc: loc ? loc : null,
  };
};

export const arabicToLatinNumbers = (arabicNumber) => {
  let result = '';
  const arabic1 = '١'.charCodeAt(0);
  const english1 = '1'.charCodeAt(0);
  for (let i = 0; i < arabicNumber.length; i++) {
    result += String.fromCharCode(arabicNumber.charCodeAt(i) - arabic1 + english1);
  }
  return result;
};

export const arabicDateToLatinDate = (arabicDate) => {
  const [year, month, day] = arabicDate.split('-');

  return `${arabicToLatinNumbers(year)}-` +
    `${arabicToLatinNumbers(month)}-` +
    `${arabicToLatinNumbers(day)}`;
};

export const getPreferredLocale = (locale, systemLocale) => systemLocale || locale;

export const getPreferredLocaleFromUser = (user) =>
  getPreferredLocale(user.locale, user.systemLocale);

export default {
  parseLocale,
  arabicToLatinNumbers,
  arabicDateToLatinDate,
  getPreferredLocale,
  getPreferredLocaleFromUser,
};
