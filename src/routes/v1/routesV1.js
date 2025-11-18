import express from 'express';
const router = express.Router();

import internalRoutes from './internal/routes-internal.js';
import wsRoutes from './ws/routes-ws.js';

import v1ResearchRoutes from './research.js';
import v1SlackNotifRoutes from './slack-notif.js';

router.use('/internal', internalRoutes);
router.use('/ws', wsRoutes);

router.use('/research', v1ResearchRoutes);
router.use('/slack-notif', v1SlackNotifRoutes);

export default router;
