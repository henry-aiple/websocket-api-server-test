import app from '../src/app.js';

import sinon from 'sinon';
import logger from '../src/tools/logger.js';

import rdb from './backend/mysql.js';
import mongodb from './backend/mongodb.js';
import dynamodb from './backend/dynamodb.js';

import {insertInitialData} from './data.js';

function createStubs() {
  try {
    // stub.
    sinon.stub(logger, 'info').callsFake(() => {});
  } catch (error) {
    console.log('[create stubs error]', error);
    throw error;
  }
}

async function cleanUpDatabaseData() {
  await rdb.cleanUp();
  await mongodb.cleanUp();
  await dynamodb.cleanUp();
}

before(async () => {
  createStubs();
  try {
    await rdb.dropTable();
    await mongodb.connect();
    await dynamodb.connect();

    await cleanUpDatabaseData();

    await rdb.init();

    await insertInitialData();
  } catch (error) {
    console.log('[before error]', error);
    throw error;
  }
});

afterEach(async () => {
  await cleanUpDatabaseData();
  await insertInitialData();
});

after(async () => {
  try {
    await rdb.dropTable();
    await cleanUpDatabaseData();
    await app.cleanUp();
  } catch (err) {
    console.log('Teardown Error', err);
  }
});
