import {
  ApiGatewayManagementApiClient, GetConnectionCommand, PostToConnectionCommand,
}
  from '@aws-sdk/client-apigatewaymanagementapi';
import config from '../../../tools/config.js';
import logger from '../../../tools/logger.js';

const awsConfig = config.aws.config;
const client = new ApiGatewayManagementApiClient({
  ...awsConfig,
  endpoint: config.websocketApi.endpoint,
});

export const getConnectionByConnId = async (connectionId) => {
  const params = {
    ConnectionId: connectionId,
  };
  const command = new GetConnectionCommand(params);
  return await client.send(command);
};

export const sendMessage = async (connectionId, message) => {
  try {
    const params = {
      ConnectionId: connectionId,
      Data: (() => {
        if (typeof message === 'object' && message !== null) {
          return JSON.stringify(message);
        }
        if (typeof message === 'string') {
          return message;
        }
        throw new Error('Message must be a JSON object or string');
      })(),
    };

    const command = new PostToConnectionCommand(params);
    return await client.send(command);
  } catch (err) {
    logger.error(`Failed to send message to connection ${connectionId}: ${err}`);
    return err;
  }
};

export default {
  getConnectionByConnId,
  sendMessage,
};
