import config from '../tools/config.js';
import logger from '../tools/logger.js';
import errors from '../helpers/errors/index.js';
// import {handleOptions} from '../helpers/auth.js';


// import jwt from 'jsonwebtoken';
import moment from 'moment';
import * as Sentry from '@sentry/node';

export const authenticateWithBasic = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new errors.Unauthorized());
  }

  const tokenized = authHeader.split(' ');
  if (tokenized.length !== 2) {
    return next(new errors.Unauthorized());
  }
  if (tokenized[0].toLowerCase() !== 'basic') {
    return next(new errors.Unauthorized());
  }
  if (tokenized[1] !== config.internal.auth) {
    return next(new errors.Unauthorized('auth code not matched'));
  }

  return next();
};

// async function verifyJwtToken(token, options) {
//   const cf = handleOptions(options);
//   let payload = null;
//   try {
//     payload = jwt.verify(token, cf.secret);
//   } catch {
//     logger.info(`failed to verify. ${token}`);
//     throw new errors.Unauthorized('token is not verified');
//   }

//   if (payload.type !== 'access' || payload.iss !== cf.iss ||
//     !payload.id || !payload.exp ||
//     !payload.uid || !isUserID(payload.uid) ||
//     !payload.did || !isDeviceID(payload.did)) {
//     throw new errors.Unauthorized('invalid token');
//   }

//   if (payload.exp < moment().unix()) {
//     throw new errors.AccessTokenExpired('token expired');
//   }

//   return userModel.getByIdForAuth(payload.id)
//     .then((user) => {
//       if (!user) {
//         logger.warn(`user ${payload.uid} does not exists. but token verified.`);
//         throw new errors.Unauthorized('user not found');
//       }
//       return {
//         ...(formatUserObj(user)),
//         // subs: {
//         //   iapHistoryId: user.subsIapHistoryId,
//         //   productId: user.subsProductId,
//         //   status: user.subsStatus,
//         //   prevStatus: user.subsPrevStatus,
//         //   startedAt: user.subsStartedAt,
//         //   expiredAt: user.subsExpiredAt,
//         //   // isGracePeriod: user.subsIsGracePeriod,
//         //   gracePeriodExpiredAt: user.subsGracePeriodExpiredAt,
//         //   isSubscribed: user.isSubscribed,
//         // },
//         // superpass: {
//         //   startedAt: user.spStartedAt,
//         //   expiredAt: user.spExpiredAt,
//         //   hasSuperpass: user.hasSuperpass ? true : false,
//         // },
//         deviceId: payload.did,
//         // ...(parseLocale(user.locale)),
//         // isPaidServiceAllowed: (user.hasSuperpass || user.isSubscribed) ? true : false,
//       };
//     });
// }

// export const authenticateWithBearer = async (req, res, next) => {
//   const token = req.headers.authorization;
//   if (!token) {
//     return next(new errors.Unauthorized());
//   }

//   const tokenized = token.split(' ');
//   if (tokenized.length !== 2) {
//     return next(new errors.Unauthorized());
//   }
//   if (tokenized[0].toLowerCase() !== 'bearer') {
//     return next(new errors.Unauthorized());
//   }

//   return verifyJwtToken(tokenized[1], config.auth.token)
//     .then((user) => {
//       req.user = user;
//       if (config.sentry?.dsn) {
//         Sentry.getCurrentScope().setUser({
//           id: user.id,
//           uid: user.uid,
//           did: user.did,
//           ip_address: req.ip,
//         });
//       }
//       return next();
//     })
//     .catch((err) => next(err));
// };

// export const authenticateSubscription = async (req, res, next) => {
//   if (!req.user.isPaidServiceAllowed) {
//     throw new errors.Unauthorized('You are not allowed to use paid services.');
//   } else {
//     return next();
//   }
// };

export default {
  authenticateWithBasic,
  // authenticateWithBearer,
  // authenticateSubscription,
};
