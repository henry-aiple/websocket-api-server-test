import mongoDb from '../../src/backend/documentdb/index.js';

import {DataCache} from '../../models/dataCache.js';
import {Research} from '../../models/research.js';

function sleep(msec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
}

export async function connect() {
  for await (const i of Array.from({length: 10}, (v, k) => (k + 1))) {
  // while (true) {
    try {
      if (mongoDb.isMongoDbConnected()) {
        break;
      }
      await sleep(1000);
    } catch (err) {
      console.log(`failed to connect to mongodb - ${i} times: ${err}`);
      await sleep(1000);
    }
  }
}

export async function cleanUp() {
  try {
    await DataCache.deleteMany();
    await Research.deleteMany();
  } catch (err) {
    console.log(err);
  }
  return;
}

export default {
  connect,
  cleanUp,
};
