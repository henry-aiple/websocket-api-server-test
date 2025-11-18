import express from 'express';
const router = express.Router();

import cacheRoutes from './cache.js';
import researchRoutes from './research.js';
import slackNotifRoutes from './slack-notif.js';

router.use('/cache', cacheRoutes);
router.use('/research', researchRoutes);
router.use('/slack-notif', slackNotifRoutes);

export default router;
