import wsConnectionModel from '../../../../models/wsConnection.js';
import {v4 as uuidv4} from 'uuid';

// This handler will be called when a client connects to the WebSocket
export const connect = async (req, res) => {
  try {
    const connectionId = req.headers['sec-websocket-key'];
    const userId = Math.floor(Math.random() * 1000000); // for example, 0 - 999999
    const userUid = uuidv4(); // Generate a random UUID

    await wsConnectionModel.addItem({
      connId: connectionId,
      userId,
      userUid,
    });

    return res.status(200).json({
      result: 'success',
      message: 'WebSocket connected',
      connectionId,
      userUid,
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
    await wsConnectionModel.deleteByConnId(connectionId);
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
    const message = req.body && req.body.message ? req.body.message : 'No message provided';
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
