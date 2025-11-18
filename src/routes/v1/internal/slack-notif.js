import express from 'express';
const router = express.Router();
import slackNotifController from '../../../controllers/v1/internal/slack-notif.js';
import auth from '../../../middlewares/auth.js';
import validator from '../../../middlewares/validators/index.js';

router.use(auth.authenticateWithBasic);

router.route('/')
  .post(validator.intSlackNotifBody, slackNotifController.sendSlackNotif);

export default router;
