import express from 'express';
const router = express.Router();
import wsHandlerController from '../../../controllers/v1/ws/handler.js';
import auth from '../../../middlewares/auth.js';
// import validator from '../../../middlewares/validators/index.js';

router.use(auth.authenticateWithBasic);

router.route('/connect')
  .post(wsHandlerController.connect);

router.route('/disconnect')
  .post(wsHandlerController.disconnect);

router.route('/default')
  .post(wsHandlerController.sendMessage);

export default router;
