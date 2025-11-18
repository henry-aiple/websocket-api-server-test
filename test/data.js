// import {fileURLToPath} from 'url';
// const __dirname = fileURLToPath(new URL('.', import.meta.url));

// import {readFileSync} from 'fs';
// const userData = JSON.parse(readFileSync(`${__dirname}/data/users.json`));

// import _ from 'lodash';
// import {v4 as genUUID} from 'uuid';
// import {keyByForLoop} from '../src/utils/util.js';

// async function insertServiceVersion() {
//   const serviceVersionData = _.map(serviceVersion.serviceVersion, Object.values);
//   await pool.query(
//     'INSERT INTO ServiceVersion(platform, minVersion, latestVersion, config) VALUES ?',
//     [serviceVersionData]);
// }

// async function insertUsers() {
//   for await (const u of userData.users) {
//     const ts = new Date();
//     u.payload.expiredAt = new Date(u.payload.expiredAt);

//     const rst = await userModel.add({
//       uid: u.uid,
//       email: u.payload.email,
//       emailVerified: u.payload.emailVerified,
//       name: u.profile.name,
//       profileImg: u.profile.profileImg,
//       description: u.profile.description,
//       birthdate: new Date(u.profile.birthdate),
//       gender: u.profile.gender,
//       timezone: u.profile.timezone,
//       locale: u.profile.locale,
//       unit: UNIT_SYSTEM.METRIC,
//       oauthType: u.oauthType,
//       payload: u.payload,
//       meta: {
//         platform: 'ios',
//         osVersion: '17.6.1',
//         appVersion: '0.1.3',
//       },
//       createdAt: ts,
//     });

//     await userModel.set({
//       id: rst[0].insertId,
//       username: u.profile.username,
//       birthdate: new Date(u.profile.birthdate),
//       gender: u.profile.gender,
//       properties: {
//         k1: 'v1',
//         o1: {
//           k2: 'v2',
//           a2: [
//             'av2-0',
//             'av2-1',
//             'av2-2',
//           ],
//         },
//       },
//       timezone: u.profile.timezone,
//       updatedAt: ts,
//     });

//     for await (const userBioType of USER_BIO_TYPES_LIST) {
//       await userBioModel.add({
//         userId: u.uid,
//         bioType: userBioType,
//         createdAt: ts,
//       });
//     }

//     for await (const userGoalType of USER_GOAL_TYPES_LIST) {
//       await userGoalModel.add({
//         userId: u.uid,
//         goalType: userGoalType,
//         createdAt: ts,
//       });
//     }
//     await userMemoryModel.add({
//       userId: u.uid,
//       createdAt: ts,
//     });

//     await subscriptionModel.set({
//       userId: u.id,
//       iapHistoryId: genUUID(),
//       productId: 'wevery_monthly',
//       status: IAP_STATUS_TYPES.SUBSCRIBED,
//       startedAt: ts,
//       expiredAt: getDaysAfter(ts, 30),
//       gracePeriodExpiredAt: null,
//       updatedAt: ts,
//     });

//     await userDietPlanModel.add({
//       userId: u.uid,
//       createdAt: ts,
//     });

//     // await firebase.db.set(firebase.db.getUserPath(fbUid), {});
//   }

//   await iapUserModel.set({
//     userId: 1,
//     paymentUserId: 'b541ae8a-6cbf-42af-a588-6ae9d868a97d',
//     updatedAt: new Date(),
//   });

//   await iapUserModel.set({
//     userId: 2,
//     paymentUserId: 'c30f3f8c-2633-4422-b0ea-809c8dc37be9',
//     updatedAt: new Date(),
//   });
// }

export async function insertInitialData() {
  // await insertUsers();
}

export default {
  insertInitialData,
};
