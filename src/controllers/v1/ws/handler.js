import logger from '../../../tools/logger.js';
import {
  getConnectionByConnId,
  sendMessage,
} from '../../../backend/aws/websocket-api/websocketApi.js';

// This handler will be called when a client connects to the WebSocket
export const connectHandler = async (req, res) => {
  try {
    // logger.info(`req.query: ${JSON.stringify(req.query)}`);
    // logger.info(`req.body: ${JSON.stringify(req.body)}`);
    // logger.info(`req.headers: ${JSON.stringify(req.headers)}`);

    const token = req.body.authenticatedToken;
    if (!token) {
      return res.status(401).json({
        error: 'Token is required',
      });
    }

    if (token !== 'xinobi' && token !== 'aiple') {
      return res.status(401).json({
        error: 'Invalid token',
      });
    }

    const {connectionId} = req.body;
    console.log(`connectionId: ${connectionId}`);

    // const userId = Math.floor(Math.random() * 1000000); // for example, 0 - 999999
    // const userUid = uuidv4(); // Generate a random UUID

    // await wsConnectionModel.addItem({
    //   connId: connectionId,
    //   userId,
    //   userUid,
    // });

    return res.status(200).json({
      result: 'success',
      message: 'WebSocket connected',
      connectionId,
      // userUid,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to connect to WebSocket', details: error.message,
    });
  }
};

// This handler will be called when a client disconnects from the WebSocket
export const disconnectHandler = async (req, res) => {
  try {
    const {connectionId} = req.body;
    // await wsConnectionModel.deleteByConnId(connectionId);
    return res.status(200).json({
      result: 'success',
      message: 'WebSocket disconnected',
      connectionId,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to disconnect from WebSocket',
      details: error.message,
    });
  }
};

// This handler is for sending/receiving messages over the WebSocket
export const defaultHandler = async (req, res) => {
  try {
    // Example: echoing the received message
    logger.info(`req.body: ${JSON.stringify(req.body)}`);
    const message = req.body && req.body.data ? req.body.data : 'No message provided';
    logger.info(`message: ${message}`);

    const {connectionId} = req.body;
    console.log(`connectionId: ${connectionId}`);

    const connection = await getConnectionByConnId(connectionId);
    console.log(`connection: ${JSON.stringify(connection)}`);

    setTimeout(function() {
      sendMessage(connectionId, '3 seconds later');
    }, 3000);

    return res.status(200).json({
      result: 'success',
      message: 'Message received',
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to process message',
      details: error.message,
    });
  }
};

export default {
  connectHandler,
  disconnectHandler,
  defaultHandler,
};
