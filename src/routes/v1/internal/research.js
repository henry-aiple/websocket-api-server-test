import express from 'express';
const router = express.Router();
import researchController from '../../../controllers/v1/internal/research.js';
import auth from '../../../middlewares/auth.js';
import validator from '../../../middlewares/validators/index.js';

router.use(auth.authenticateWithBasic);

router.route('/')
  .post(validator.intResearchBody, researchController.setResearchResult);

export default router;
