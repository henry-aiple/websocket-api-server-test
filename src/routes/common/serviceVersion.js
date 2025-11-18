import express from 'express';
const router = express.Router();

import validator from '../../middlewares/validators/index.js';
import svrVerController from '../../controllers/common/serviceVersion.js';

router.route('/')
  .get(validator.serviceVersionQuery, svrVerController.getServiceVersion);

export default router;
