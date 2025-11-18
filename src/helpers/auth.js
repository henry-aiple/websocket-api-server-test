import logger from '../tools/logger.js';
// import jwt from 'jsonwebtoken';
import moment from 'moment';

import errors from './errors/index.js';
// import tokenModel from '../../models/token.js';

const defaults = {
  accessTokenEx: '1 days',
  // refreshTokenEx: '30 days',
};

// export const handleOptions = (options) => {
//   const accessExpiry = options.accessTokenEx || defaults.accessTokenEx;
//   // const refreshExpiry = options.refreshTokenEx || defaults.refreshTokenEx;
//   return {
//     accessTokenEx: accessExpiry.split(' '),
//     // refreshTokenEx: refreshExpiry.split(' '),
//     secret: options.secret,
//     iss: options.iss,
//   };
// };

// export const issueToken = (id, uid, options) => {
//   const cf = handleOptions(options);
//   const accessTokenExpiry = moment().add(...(cf.accessTokenEx));
//   const deviceId = generateDeviceID();

//   const jwtPayload = {
//     id,
//     uid,
//     did: deviceId,
//     iss: cf.iss,
//   };

//   const accessToken = jwt.sign({
//     exp: accessTokenExpiry.unix(),
//     type: 'access',
//     ...jwtPayload,
//   }, cf.secret);

//   const refreshToken = jwt.sign({
//     type: 'refresh',
//     ...jwtPayload,
//   }, cf.secret);

//   // issue token.
//   return {
//     deviceId,
//     accessToken,
//     refreshToken,
//     expiredAt: accessTokenExpiry.toDate(),
//   };
// };

// export const refreshAccessToken = async (refreshToken, options) => {
//   const cf = handleOptions(options);
//   let payload = null;

//   try {
//     payload = jwt.verify(refreshToken, cf.secret);
//   } catch {
//     logger.info(`failed to verify. ${refreshToken}`);
//     throw new errors.Unauthorized('token is not verified');
//   }

//   if (payload.type !== 'refresh' || payload.iss !== cf.iss || !payload.id ||
//     !payload.uid || !isUserID(payload.uid) ||
//     !payload.did || !isDeviceID(payload.did)) {
//     throw new errors.Unauthorized('invalid token');
//   }

//   // if (payload.exp < moment().unix()) {
//   //   throw new errors.AccessTokenExpired();
//   // }

//   const oldToken = await tokenModel.getTokenByUserIdAndDid(payload.id, payload.did);
//   if (!oldToken || refreshToken !== oldToken.refreshToken) {
//     throw new errors.BadRequest('refreshToken is not valid');
//   }

//   try {
//     const accessTokenExpiry = moment().add(...(cf.accessTokenEx));
//     const accessToken = jwt.sign({
//       exp: accessTokenExpiry.unix(),
//       type: 'access',
//       id: payload.id,
//       uid: payload.uid,
//       did: payload.did,
//       iss: cf.iss,
//     }, cf.secret);

//     await tokenModel.refresh(
//       payload.id,
//       payload.did,
//       {
//         accessToken,
//         refreshToken,
//         expiredAt: accessTokenExpiry.toDate(),
//       });

//     return accessToken;
//   } catch (err) {
//     logger.error(`failed to refresh token. ${err}`);
//     throw new errors.Unauthorized();
//   }
// };
