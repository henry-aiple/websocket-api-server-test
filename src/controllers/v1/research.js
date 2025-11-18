// import config from '../../tools/config.js';
// import logger from '../../tools/logger.js';
// import errors from '../../helpers/errors/index.js';

import researchModel from '../../../models/research.js';
import {v4 as genUUID} from 'uuid';
import {notifyNewResearchReq} from '../../helpers/slack-notification.js';
// import documentDb from '../../backend/documentdb/index.js';

export const triggerResearch = async (req, res) => {
  const {
    email, tiktokAccountId, keywords, countryCode,
  } = req.body;

  const requestedAt = new Date();

  const researchId = genUUID();

  const research = await researchModel.add({
    researchId,
    input: {
      email, tiktokAccountId, keywords, countryCode,
    },
    requestedAt,
  });

  notifyNewResearchReq(research);

  return res.status(200).json({
    result: 'success',
    research,
  });
};

export const getResearch = async (req, res) => {
  const {researchId} = req.params;

  const research = await researchModel.getById(researchId);

  return res.status(200).json({
    result: 'success',
    research,
  });
};

export default {
  triggerResearch,
  getResearch,
};
