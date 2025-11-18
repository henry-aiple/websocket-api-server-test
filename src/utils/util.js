import {promisify} from 'util';

export const sleep = promisify(setTimeout);

export const isArray = function(a) {
  return Array.isArray(a);
};

export const isObject = function(o) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

export const isDate = function(myDate) {
  return myDate instanceof Date;
  // return myDate.constructor.toString().indexOf('Date') > -1;
};

export const uniqFast = (a) => {
  const seen = {};
  const out = [];
  let j = 0;
  for (let i = 0; i < a.length; i++) {
    const item = a[i];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
};

export const keyByForLoop = (array, fn) => {
  const acc = {};
  for (let i = 0; i < array.length; i++) {
    acc[fn(array[i])] = array[i];
  }
  return acc;
};

export const groupByKey = (array, key) =>
  array.reduce((acc, item) => {
    const val = item[key];
    if (!acc[val]) {
      acc[val] = [];
    }
    acc[val].push(item);
    return acc;
  }, {});

export const groupByKeyAndSubKey = (array, key, subKey) =>
  array.reduce((acc, item) => {
    const val = item[key];
    const subVal = item[subKey];
    if (!acc[val]) {
      acc[val] = {};
    }
    if (!acc[val][subVal]) {
      acc[val][subVal] = [];
    }
    acc[val][subVal].push(item);
    return acc;
  }, {});

export const groupByKeys = (array, keys) => {
  if (!Array.isArray(keys) || keys.length === 0) {
    throw new Error('keys must be an array and not empty');
  }

  return array.reduce((acc, item) => {
    let target = acc;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = item[key];
      if (i === keys.length - 1) {
        if (!target[val]) {
          target[val] = [];
        }
        target[val].push(item);
      } else {
        if (!target[val]) {
          target[val] = {};
        }
        target = target[val];
      }
    }
    return acc;
  }, {});
};

export const transformArrayToObject = (arr, key1, key2) =>
  arr.reduce((acc, item) => {
    if (item[key1] !== undefined && item[key2] !== undefined) {
      acc[item[key1]] = item[key2];
    }
    return acc;
  }, {});

export const deleteMultipleKeys = (obj, keys) => {
  for (let i = 0; i < keys.length; i++) {
    delete obj[keys[i]];
  }
};

export const shuffle = (array) => {
  for (let index = array.length - 1; index > 0; index--) {
    // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
    const randomPosition = Math.floor(Math.random() * (index + 1));
    // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
    const temporary = array[index];
    array[index] = array[randomPosition];
    array[randomPosition] = temporary;
  }

  return array;
};

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // 최댓값은 제외, 최솟값은 포함
};

export const toCamel = (s) =>
  s.replace(/([-_][a-z])/ig, ($1) =>
    $1.toUpperCase()
      .replace('-', '')
      .replace('_', ''),
  );

export const keysToCamel = function(o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamel(o[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => keysToCamel(i));
  }

  return o;
};

const access = (object, path) => path.split('.').reduce((o, i) => o[i], object);

export const getMinMaxValInObjByKeyPath = (object, path) => {
  let minVal;
  let maxVal;

  if (object) {
    if (isArray(object) && object.length > 0) {
      const initVal = access(object[0], path);
      minVal = initVal;
      maxVal = initVal;
      for (let i = 1; i < object.length; i++) {
        if (object[i]) {
          const val = access(object[i], path);
          if (val < minVal) {
            minVal = val;
          }
          if (val > maxVal) {
            maxVal = val;
          }
        }
      }
      return {
        minVal,
        maxVal,
      };
    } else {
      const val = access(object, path);
      return {
        minVal: val,
        maxVal: val,
      };
    }
  }

  return null;
};

export const sortAndUnique = (arr, order = 1) => {
  if (arr.length === 0) return arr;
  arr = arr.sort((a, b) => {
    if (a > b) {
      return order;
    } else if (a < b) {
      return (-1) * order;
    } else {
      return 0;
    }
  });
  const ret = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] !== arr[i]) {
      ret.push(arr[i]);
    }
  }
  return ret;
};


export const allAreTrue = (arr) =>
  arr.every((e) => e === true);


export const isMarkdown = (str) => {
  if (typeof str !== 'string') return false;
  const markdownPatterns = [
    /\*\*.*?\*\*/, // Bold
    /__.*?__/g, // Bold (alternative)
    /\*.*?\*/, // Italic
    /_.*?_/, // Italic (alternative)
    /~.*?~/, // Strikethrough
    /`.*?`/, // Inline code
    /```[\s\S]*?```/, // Code blocks
    />.*?/, // Blockquotes
    /#\s.*?/, // Headers
    /\n{2,}/, // Paragraphs
  ];
  return markdownPatterns.some((pattern) => pattern.test(str));
};

export const removeMarkdown = (str) => {
  if (!isMarkdown(str)) return str;
  return str
    .replace(/[*_~`]/g, '') // Remove bold, italic, strikethrough, and inline code markers
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/```/g, '') // Remove remaining code markers
    .replace(/>\s?/g, '') // Remove blockquote markers
    .replace(/\n{2,}/g, '\n') // Remove extra newlines
    .trim(); // Trim leading and trailing whitespace
};

export const truncateString = (str, maxLength, ellipsis = '...') => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}${ellipsis}`;
};

export const processArrayInChunks = async (array, chunkSize, fn) => {
  const totalChunks = Math.ceil(array.length / chunkSize);
  for await (const i of Array.from({length: totalChunks}, (_, k) => k)) {
    const chunk = array.slice(i * chunkSize, (i + 1) * chunkSize);
    await fn(chunk);
  }
};

export const roundToTwoDecimals = (num) => {
  if (num === null || num === undefined) return null;
  if (typeof num !== 'number') return num;
  if (Number.isInteger(num)) return num;
  return Math.round(num * 100) / 100;
};

export default {
  sleep,
  isArray,
  isObject,
  isDate,
  uniqFast,
  keyByForLoop,
  groupByKey,
  groupByKeyAndSubKey,
  groupByKeys,
  transformArrayToObject,
  deleteMultipleKeys,
  shuffle,
  getRandomInt,
  keysToCamel,
  getMinMaxValInObjByKeyPath,
  sortAndUnique,
  allAreTrue,
  isMarkdown,
  removeMarkdown,
  truncateString,
  processArrayInChunks,
  roundToTwoDecimals,
};
