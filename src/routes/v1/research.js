import express from 'express';
const router = express.Router();
import researchController from '../../controllers/v1/research.js';

// import auth from '../../middlewares/auth.js';
import validator from '../../middlewares/validators/index.js';

// router.use(auth.authenticateWithBearer);

router.route('/')
  .post(validator.researchBody, researchController.triggerResearch);

// eslint-disable-next-line max-len
router.route(/^\/(?<researchId>[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/)
  .get(researchController.getResearch);

export default router;
