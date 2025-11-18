import dynamodb from '../src/backend/aws/dynamodb/index.js';
import {DynamoDBAttributeTypes} from '../src/backend/aws/dynamodb/index.js';
// import config from '../src/tools/config.js';

const WsConnectionSchema = {
  tableName: 'WsConnection',
  partitionKey: 'connId',
  sortKey: null,
  globalSecondaryIndexes: [{
    indexName: 'userId-index',
    partitionKey: 'userId',
    sortKey: null,
  }, {
    indexName: 'userUid-index',
    partitionKey: 'userUid',
    sortKey: null,
  }],
  attributes: {
    connId: {
      name: 'connId',
      type: DynamoDBAttributeTypes.STRING,
    },
    userId: {
      name: 'userId',
      type: DynamoDBAttributeTypes.NUMBER,
    },
    userUid: {
      name: 'userUid',
      type: DynamoDBAttributeTypes.STRING,
    },
    createdAt: {
      name: 'createdAt',
      type: DynamoDBAttributeTypes.NUMBER,
    },
    updatedAt: {
      name: 'updatedAt',
      type: DynamoDBAttributeTypes.NUMBER,
    },
  },
  ttl: {
    name: 'expireAt',
    type: DynamoDBAttributeTypes.NUMBER,
  },
};

export const getSchema = () => WsConnectionSchema;

export const scanItems = async () => {
  const items = await dynamodb.scanItems(WsConnectionSchema);
  return items;
};

export const getByConnId = async (connId) => {
  const item = await dynamodb.getItem(WsConnectionSchema, {
    queryKey: 'connId',
    queryValue: connId,
    querySortKey: null,
    querySortValue: null,
  });
  return item;
};

// export const queryByConnId = async (connId) => {
//   const items = await dynamodb.queryItems(WsConnectionSchema, connId);
//   return items;
// };

export const getByUserId = async (userId) => {
  const items = await dynamodb.queryItems(WsConnectionSchema, {
    queryKey: 'userId',
    queryValue: userId,
    // querySortKey,
    // querySortKeyStart,
    // querySortKeyEnd,
  });
  return items;
};

export const getByUserUid = async (userUid) => {
  const items = await dynamodb.queryItems(WsConnectionSchema, {
    queryKey: 'userUid',
    queryValue: userUid,
    // querySortKey,
    // querySortKeyStart,
    // querySortKeyEnd,
  });
  return items;
};

export const updateItemByConnId = async (connId, data) => {
  const item = await dynamodb.updateItem(WsConnectionSchema, {
    queryKey: 'connId',
    queryValue: connId,
    querySortKey: null,
    querySortValue: null,
    data,
  });
  return item;
};

export const addItem = async (item) => {
  const curTime = Math.floor(new Date().getTime() / 1000);
  const items = await dynamodb.putItem(WsConnectionSchema, {
    ...item,
    createdAt: curTime,
    updatedAt: curTime,
  });
  return items;
};

export const updateByConnId = async (connId, data) => {
  const item = await dynamodb.updateItem(WsConnectionSchema, {
    queryKey: 'connId',
    queryValue: connId,
    querySortKey: null,
    querySortValue: null,
    data,
  });
  return item;
};

export const updateByUserId = async (userId, data) => {
  const item = await dynamodb.updateItem(WsConnectionSchema, {
    queryKey: 'userId',
    queryValue: userId,
    querySortKey: null,
    querySortValue: null,
    data,
  });
  return item;
};

export const updateByUserUid = async (userUid, data) => {
  const item = await dynamodb.updateItem(WsConnectionSchema, {
    queryKey: 'userUid',
    queryValue: userUid,
    querySortKey: null,
    querySortValue: null,
    data,
  });
  return item;
};

export const deleteByConnId = async (connId) => {
  const item = await dynamodb.deleteItem(WsConnectionSchema, {
    queryKey: 'connId',
    queryValue: connId,
    querySortKey: null,
    querySortValue: null,
  });
  return item;
};

export const deleteByUserId = async (userId) => {
  const item = await dynamodb.deleteItem(WsConnectionSchema, {
    queryKey: 'userId',
    queryValue: userId,
    querySortKey: null,
    querySortValue: null,
  });
  return item;
};

export const deleteByUserUid = async (userUid) => {
  const item = await dynamodb.deleteItem(WsConnectionSchema, {
    queryKey: 'userUid',
    queryValue: userUid,
    querySortKey: null,
    querySortValue: null,
  });
  return item;
};

export default {
  getSchema,
  scanItems,
  getByConnId,
  getByUserId,
  getByUserUid,
  updateByConnId,
  updateByUserId,
  updateByUserUid,
  addItem,
  deleteByConnId,
  deleteByUserId,
  deleteByUserUid,
};

