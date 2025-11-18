import express from 'express';
const router = express.Router();

import healthController from '../../controllers/common/health.js';

router.route('/')
  .get(healthController.healthCheck);

export default router;
