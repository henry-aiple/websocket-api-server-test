import express from 'express';
const router = express.Router();
import cacheController from '../../../controllers/v1/internal/cache.js';
import auth from '../../../middlewares/auth.js';
import validator from '../../../middlewares/validators/index.js';

router.use(auth.authenticateWithBasic);

router.route('/')
  .get(validator.intCacheQuery, cacheController.getDataCache)
  .post(validator.intCacheBody, cacheController.setDataCache);

router.route('/country-code-to-create-data-cache')
  .get(cacheController.getCountryCodeToCreateDataCache);

export default router;
