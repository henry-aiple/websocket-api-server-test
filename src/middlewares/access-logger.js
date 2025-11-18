/* eslint-disable prefer-rest-params */
// import config from '../tools/config.js';
import _ from 'lodash';
import winston from 'winston';
import moment from 'moment';
import utils from '../utils/index.js';

// default options
const defaultOptions = {
  exculdeURLs: [],
  reqHeaderExclude: [],
  levels: null,
};

/**
 * Console Transportation
 */
const additionalAccessFormat = winston.format((info) => {
  // additional field.
  info.type = 'access';
  return info;
});

const consoleTransport = new winston.transports.Console({
  json: true,
  stringify: true,
  format: winston.format.combine(
    additionalAccessFormat(),
    winston.format.json(),
  ),
});

/**
 * Setup winston logger.
 */
const logger = winston.createLogger({
  transports: consoleTransport,
});

function log(req, res, options) {
  // check excludeURLs.
  if (!utils.shouldLog(req.path, options.exculdeURLs)) {
    return;
  }

  // header filtering. header will be deepcopy-ed.
  const reqHeaders = utils.getFilteredHeader(req.headers,
    options.reqHeaderExclude);

  // if (config.env === 'prod') {
  //   if (req.originalUrl === '/v1/prompt') {
  //     res._bodyJson = _.omit(res._bodyJson, ['contexts', 'promptHistory.contexts']);
  //   }
  // }

  const logItem = {
    request_header: JSON.stringify(reqHeaders),
    request_body: utils.getBodyStr(req.body),
    request_url: req.originalUrl,
    response_body: JSON.stringify(res._bodyJson),
    status_code: res.statusCode,
    content_length: utils.getContentLength(res),
    elapsed_time: res.endedAt - req.startedAt,
    method: req.method || '-',
    protocol: req.protocol || 'http',
    remote_host: req.ip,
    remote_ip: req.ip,
    started_at: moment(req.startedAt).toISOString(),
    timestamp: moment(res.endAt).toISOString(),
    user_id: req.user ? req.user.id : '-',
    user_uid: req.user ? req.user.uid : '-',
  };

  // get log level.
  const logLevel = utils.getLogLevel(res.statusCode, options.levels);

  // logging!
  logger[logLevel]('', {...logItem, ...(req.meta)});
}

export default function accessLogger(logOptions) {
  const options = logOptions || {};

  _.defaultsDeep(options, defaultOptions);

  if (options.reqHeaderExclude) {
    // convert into lower case.
    _.forEach(options.reqHeaderExclude, (ele, idx) => {
      if (typeof ele !== 'string') {
        options.reqHeaderExclude[idx] = ele.toString();
      }
      options.reqHeaderExclude[idx] = options.reqHeaderExclude[idx].toLowerCase();
    });
  }

  return function(req, res, next) {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const oldJson = res.json;
    const chunks = [];
    let isAlreadySent = false;

    const userAgent = req.headers['user-agent'];
    if (typeof userAgent === 'string' && userAgent.startsWith('ELB-HealthChecker')) {
      return next();
    }

    // req.startedAt = moment();
    req.meta = req.meta || {};

    res.write = function(chunk) {
      chunks.push(Buffer.from(chunk));
      if (!isAlreadySent) {
        oldWrite.apply(res, arguments);
      }
    };

    res.json = function(bodyJson) {
      res._bodyJson = bodyJson;
      if (!isAlreadySent) {
        oldJson.apply(res, arguments);
      }
    };

    res.end = function(chunk) {
      isAlreadySent = true;
      if (chunk) {
        chunks.push(Buffer.from(chunk));
      }

      res._bodyStr = Buffer.concat(chunks).toString('utf8');
      res.endedAt = moment();

      oldEnd.apply(res, arguments);

      log(req, res, options);
    };

    return next();
  };
}
