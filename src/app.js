import express from 'express';
import cors from 'cors';
import timeout from 'connect-timeout';
import {ValidationError} from 'express-validation';
import * as Sentry from '@sentry/node';

import config from './tools/config.js';
import logger from './tools/logger.js';

import backend from './backend/index.js';

import accessLogger from './middlewares/access-logger.js';
import reqTime from './middlewares/req-time.js';
import errors from './helpers/errors/index.js';

import routes from './routes/routes.js';

const app = express();

app.set('trust proxy', true);
app.use(reqTime);
app.use(timeout('5s'));

if (config.sentry?.dsn) {
  Sentry.init({
    dsn: config.sentry.dsn,
    environment: config.env,
  });
  Sentry.setupExpressErrorHandler(app);
}

if (process.env.NODE_ENV !== 'test') {
  app.use(accessLogger());
}

// Disable etag generation for dynamic and static responses
app.set('etag', false);
app.use(express.static('public', {etag: false}));

app.use(cors());

// Initialize backend
backend.init();

// Attach rawBody as text for each request
app.use((req, res, next) => {
  req.rawBody = new Promise((resolve) => {
    let buf = '';
    req.on('data', (chunk) => {
      buf += chunk;
    });
    req.on('end', () => {
      resolve(buf);
    });
  });
  next();
});

// Middleware to handle body parser errors
const handleBodyParserError = (middleware) => (req, res, next) => {
  middleware(req, res, (err) => {
    if (err) {
      logger.error(err);
      next(new errors.BadRequest());
    } else {
      next();
    }
  });
};

app.use(handleBodyParserError(express.json({limit: '5mb'})));
app.use(express.urlencoded({limit: '5mb', extended: true}));

app.use('/', routes);

if (config.sentry?.dsn) {
  app.use(Sentry.expressErrorHandler({
    shouldHandleError(err) {
      if (
        err instanceof ValidationError ||
        (err instanceof errors.HttpError && !(err instanceof errors.InternalServerError))
      ) {
        return false;
      }
      return true;
    },
  }));
}

// 404 handler
app.use((req, res, next) => {
  next(new errors.NotFound());
});

// General error handler
function errorHandler({showStack}) {
  return (err, req, res, next) => {
    if (res.headersSent) return next(err);

    if (err instanceof ValidationError) {
      if (showStack) {
        console.log(`Validation Error: ${JSON.stringify(err)}`);
      }
      const reqError = new errors.ReqValidationFailed(null, err.details);
      return res.status(err.statusCode).json({error: reqError.error});
    }

    if (err instanceof errors.HttpError) {
      return res.status(err.code).json({error: err.error});
    }

    let msg = null;
    if (err?.code === 'ETIMEDOUT') {
      msg = 'response timeout';
    }
    const internalError = new errors.InternalServerError(msg);
    const body = {error: internalError.error};
    if (showStack) {
      body.stack = err.stack;
    }
    return res.status(internalError.code).json(body);
  };
}

const env = app.get('env');
if (env === 'test' || env === 'development') {
  app.use(errorHandler({showStack: true}));
} else if (env === 'beta' || env === 'production') {
  app.use(errorHandler({showStack: false}));
}

app.cleanUp = async () => {
  try {
    await backend.cleanUp();
  } catch (err) {
    logger.info(`backend cleanUp with error. ${err}`);
  }

  if (config.sentry?.dsn) {
    try {
      await Sentry.close();
    } catch (err) {
      logger.info(`sentry closed with error. ${err}`);
    }
  }
};

export default app;
