import _ from 'lodash';

const VALID_LEVELS = ['trace', 'debug', 'info', 'warn', 'error'];
const DEFAULT_LEVEL = 'info';

export const getBodyStr = (body) => {
  if (_.isEmpty(body)) {
    return '-';
  }

  const bodyStr = (typeof body === 'object') ? JSON.stringify(body) : body;
  return bodyStr;
};

export const getLogLevel = (statusCode, levelsMap) => {
  let level = DEFAULT_LEVEL;

  if (levelsMap) {
    const status = statusCode.toString();
    if (levelsMap[status]) {
      level = VALID_LEVELS.includes(levelsMap[status]) ? levelsMap[status] : level;
    } else {
      const statusGroup = `${status.substring(0, 1)}xx`;
      level = VALID_LEVELS.includes(levelsMap[statusGroup]) ? levelsMap[statusGroup] : level;
    }
  }
  return level;
};

export const shouldLog = (requestPath, excludeURLsParam) => {
  const excludeURLs = excludeURLsParam || [];
  return _.every(excludeURLs, (path) => requestPath !== path);
};

export const getContentLength = (res) => {
  const contentLength = res.getHeaders()['content-length'];
  if (isNaN(contentLength)) {
    return '-';
  }
  return contentLength * 1;
};

export const getFilteredHeader = (header, excludeFilterParam) => {
  const excludeFilter = excludeFilterParam || {};
  const cloned = {...header};
  _.forEach(excludeFilter, (ele) => {
    delete cloned[ele];
  });
  return cloned;
};

export default {
  getBodyStr,
  getLogLevel,
  shouldLog,
  getContentLength,
  getFilteredHeader,
};
