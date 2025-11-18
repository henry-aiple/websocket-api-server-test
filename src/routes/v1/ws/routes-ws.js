import express from 'express';
const router = express.Router();

import handlerRoutes from './handler.js';

router.use('/handler', handlerRoutes);

export default router;
