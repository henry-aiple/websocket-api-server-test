import express from 'express';
const router = express.Router();
import wsHandlerController from '../../../controllers/v1/ws/handler.js';
// import auth from '../../../middlewares/auth.js';
// import validator from '../../../middlewares/validators/index.js';

// router.use(auth.authenticateWithBasic);

router.route('/connect')
  .post(wsHandlerController.connectHandler);

router.route('/disconnect')
  .post(wsHandlerController.disconnectHandler);

router.route('/default')
  .post(wsHandlerController.defaultHandler);

export default router;
