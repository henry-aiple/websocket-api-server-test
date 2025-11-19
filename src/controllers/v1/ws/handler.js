// import wsConnectionModel from '../../../../models/wsConnection.js';
// import {v4 as uuidv4} from 'uuid';
import logger from '../../../tools/logger.js';

// This handler will be called when a client connects to the WebSocket
export const connect = async (req, res) => {
  try {
    logger.info(`req.query: ${JSON.stringify(req.query)}`);
    logger.info(`req.headers: ${JSON.stringify(req.headers)}`);

    const {token} = req.query;
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

    const connectionId = req.headers['sec-websocket-key'];
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
export const disconnect = async (req, res) => {
  try {
    const connectionId = req.headers['sec-websocket-key'];
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
export const sendMessage = async (req, res) => {
  try {
    // Example: echoing the received message
    logger.info(`req.body: ${JSON.stringify(req.body)}`);
    const message = req.body && req.body.message ? req.body.message : 'No message provided';
    logger.info(`message: ${message}`);
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
  connect,
  disconnect,
  sendMessage,
};
