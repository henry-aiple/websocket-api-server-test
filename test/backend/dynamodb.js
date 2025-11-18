import dynamodb from '../../src/backend/aws/dynamodb/index.js';

import wsConnModel from '../../models/wsConnection.js';

function sleep(msec) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
}

async function testScanItems() {
  const items = await wsConnModel.scanItems();
  console.log(items);
  return items;
}

async function testPutItem() {
  await wsConnModel.addItem({
    connId: 'connId0987654321',
    userId: 100,
    userUid: 'userUid1234567890',
    createdAt: 1715769600,
    updatedAt: 1715769600,
  });
}

async function testQueryItems() {
  const items = await wsConnModel.getByConnId('connId0987654321');
  console.log(items);

  const updateItem = await wsConnModel.updateByConnId('connId0987654321', {
    userId: 200,
    userUid: 'userUid1234567890-updated',
  });
  console.log(`updateItem: ${JSON.stringify(updateItem)}`);

  const getItemAfterUpdate = await wsConnModel.getByConnId('connId0987654321');
  console.log(`getItemAfterUpdate: ${JSON.stringify(getItemAfterUpdate)}`);

  return items;
}

async function testDeleteItem() {
  const deleteItem = await wsConnModel.deleteByConnId('connId0987654321');
  console.log(`deleteItem: ${JSON.stringify(deleteItem)}`);

  return deleteItem;
}

export async function connect() {
  for await (const i of Array.from({length: 10}, (v, k) => (k + 1))) {
    try {
      if (dynamodb.isDynamoDBConnected()) {
        break;
      }
      await sleep(1000);
    } catch (err) {
      console.log(`failed to connect to dynamodb - ${i} times: ${err}`);
      await sleep(1000);
    }
  }

  console.log('testScanItems');
  await testScanItems();
  console.log('testPutItem');
  await testPutItem();
  console.log('testScanItems');
  await testScanItems();
  console.log('testQueryItems');
  await testQueryItems();


  console.log('testDeleteItem');
  await testDeleteItem();


  await dynamodb.deleteAllItems(wsConnModel.getSchema());

  console.log('testScanItems');
  await testScanItems();

  return;
}

export async function cleanUp() {
  try {
    await dynamodb.closeDynamoDBConnection();
  } catch (err) {
    console.log(err);
  }
  return;
}

export default {
  connect,
  cleanUp,
};
