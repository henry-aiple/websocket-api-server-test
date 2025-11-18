import logger from '../tools/logger.js';
import rdb from './rdb/index.js';
import documentdb from './documentdb/index.js';

export const init = async () => {
  // init code
  logger.info(`backend start.`);
};

export const cleanUp = async () => {
  try {
    await rdb.pool.end();
    await rdb.poolRo.end();
    documentdb.closeMongoDbConnection();
  } catch (err) {
    logger.info(`backend cleanUp error. ${err}`);
  }
};

export default {
  init,
  cleanUp,
};
