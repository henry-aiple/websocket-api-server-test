import path from 'path';
import mongoose from 'mongoose';
import logger from '../../tools/logger.js';
import config from '../../tools/config.js';
import {fileURLToPath} from 'url';

// const __dirname = fileURLToPath(new URL('.', import.meta.url));
const __filename = fileURLToPath(import.meta.url);

let mongoOptions = null;
let isConnectedBefore = false;

if (config.mongodb.tls) {
  let certpath = null;

  if (path.isAbsolute(config.mongodb.caCert)) {
    certpath = config.mongodb.caCert;
  } else {
    certpath = path.join(path.dirname(__filename), '../../../', config.mongodb.caCert);
  }

  mongoOptions = {
    // useNewUrlParser: true,
    // useFindAndModify: false, // mongoose 6.x always set useFindAndModify: false, no more required
    // useUnifiedTopology: true,
    tlsCAFile: certpath,
    // sslCA: certpath,
  };
} else {
  mongoOptions = {
    // useNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  };
}

mongoose.connection.on('error', function(err) {
  logger.error(`Error in MongoDb connection: ${err}`);
  mongoose.disconnect();
});

mongoose.connection.on('reconnected', function() {
  logger.info('MongoDB reconnected!');
});

mongoose.connection.on('disconnected', function() {
  logger.error('MongoDB disconnected!');
  if (!isConnectedBefore) {
    mongoose.connect(config.mongodb.host, mongoOptions);
  }
});

mongoose.connection.on('connected', function() {
  isConnectedBefore = true;
  logger.info('Connected to MongoDB');
});

mongoose.set('strictQuery', false);
mongoose.connect(config.mongodb.host, mongoOptions);

export function isMongoDbConnected() {
  if (mongoose.STATES[mongoose.connection.readyState] === 'connected') {
    return true;
  }

  return false;
}

export function closeMongoDbConnection() {
  if (isMongoDbConnected()) {
    mongoose.disconnect();
  }

  return;
}

export async function startSession() {
  return await mongoose.startSession();
}

export default {
  isMongoDbConnected,
  closeMongoDbConnection,
  startSession,
};
