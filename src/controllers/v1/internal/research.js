// import config from '../../../tools/config.js';
// import logger from '../../../tools/logger.js';
import errors from '../../../helpers/errors/index.js';

import researchModel from '../../../../models/research.js';
import {notifyNewResearchDone} from '../../../helpers/slack-notification.js';

// Basic Authentication Required
export const setResearchResult = async (req, res) => {
  const {
    researchId,
    output,
  } = req.body;

  const completedAt = new Date();

  const research = await researchModel.getById(researchId);
  if (!research) {
    throw new errors.TargetNotFound('research not found');
  }

  const updatedResearch = await researchModel.set({
    researchId: research.researchId,
    output,
    completedAt,
  });

  notifyNewResearchDone(updatedResearch);

  return res.status(200).json({
    result: 'success',
    research: updatedResearch,
  });
};

export default {
  setResearchResult,
};
