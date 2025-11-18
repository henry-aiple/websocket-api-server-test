import express from 'express';
const router = express.Router();

import routersV1 from './v1/routesV1.js';
import serviceVersionRoutes from './common/serviceVersion.js';
import healthRoutes from './common/health.js';

router.use('/v1', routersV1);
router.use(['/service-version', '/service_version'], serviceVersionRoutes);
router.use('/health', healthRoutes);

export default router;
