import app from './app.js';
import logger from './tools/logger.js';
import {createServer} from 'http';
import config from './tools/config.js';

const server = createServer(app);

function handleShutdown(signal) {
  logger.info(`${signal} signal received. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await app.cleanUp();
      logger.info('Server closed successfully.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during server shutdown:', err);
      process.exit(1);
    }
  });
}

server.listen(config.port, '0.0.0.0', () => {
  logger.info(`Server listening on port ${config.port}`);
});

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
