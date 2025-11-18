// import config from '../../../tools/config.js';
// import logger from '../../../tools/logger.js';
// import errors from '../../../helpers/errors/index.js';

import {notifyCustomEventBlock} from '../../../helpers/slack-notification.js';

// Basic Authentication Required
export const sendSlackNotif = async (req, res) => {
  const {
    appName, eventName, data,
  } = req.body;

  notifyCustomEventBlock(appName, eventName, data);

  return res.status(200).json({
    result: 'success',
  });
};

export default {
  sendSlackNotif,
};
