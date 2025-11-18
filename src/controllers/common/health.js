import logger from '../../tools/logger.js';
import mongodb from '../../backend/documentdb/index.js';

export const healthCheck = async (req, res) => {
  const mongodbHealth = await mongodb.isMongoDbConnected();
  if (!mongodbHealth) {
    logger.error('mongodb failed');
  }

  return res.status(200).json({
    result: 'success',
  });
};

export default {
  healthCheck,
};
