import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
// import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';

// import moment from 'moment';
import logger from '../../../tools/logger.js';
import config from '../../../tools/config.js';

import {inspect} from 'util';

const awsConfig = config.aws.config;
const client = new DynamoDBClient({
  ...awsConfig,
  ...(config.env === 'test' ? {endpoint: config.dynamodb.endpoint} : {}),
});

const docClient = DynamoDBDocumentClient.from(client);

// DynamoDB Attribute Types Enum
export const DynamoDBAttributeTypes = Object.freeze({
  STRING: 'S',
  NUMBER: 'N',
  BINARY: 'B',
  BOOL: 'BOOL',
  NULL: 'NULL',
  LIST: 'L',
  MAP: 'M',
  STRING_SET: 'SS',
  NUMBER_SET: 'NS',
  BINARY_SET: 'BS',
});

function isNullOrUndefined(val) {
  return val === null || val === undefined;
}

function isNotNullOrUndefined(val) {
  return val !== null && val !== undefined;
}

function getGsiKeys(schema) {
  const {globalSecondaryIndexes} = schema;
  return globalSecondaryIndexes.map((index) => {
    return {
      indexName: index.indexName,
      partitionKey: index.partitionKey,
      sortKey: index.sortKey,
    };
  });
}

function validateAttributeType(attribute, value) {
  const {type} = attribute;
  const validators = {
    [DynamoDBAttributeTypes.STRING]: (value) => typeof value === 'string',
    [DynamoDBAttributeTypes.NUMBER]: (value) => typeof value === 'number',
    [DynamoDBAttributeTypes.BINARY]: (value) => value instanceof Buffer,
    [DynamoDBAttributeTypes.BOOL]: (value) => typeof value === 'boolean',
    [DynamoDBAttributeTypes.NULL]: (value) => value === null,
    [DynamoDBAttributeTypes.LIST]: (value) => Array.isArray(value),
    [DynamoDBAttributeTypes.MAP]: (value) =>
      typeof value === 'object' && value !== null && !Array.isArray(value),
    [DynamoDBAttributeTypes.STRING_SET]: (value) =>
      Array.isArray(value) && value.every((item) => typeof item === 'string'),
    [DynamoDBAttributeTypes.NUMBER_SET]: (value) =>
      Array.isArray(value) && value.every((item) => typeof item === 'number'),
    [DynamoDBAttributeTypes.BINARY_SET]: (value) =>
      Array.isArray(value) && value.every((item) => item instanceof Buffer),
  };

  if (!validators[type]) {
    throw new Error(`Invalid attribute type: ${type}`);
  }
  return validators[type](value);
}

function validateAttributes(schema, data) {
  const {attributes, partitionKey} = schema;

  const gsiKeys = getGsiKeys(schema);

  // Check for required partition key
  if (isNullOrUndefined(data[partitionKey])) {
    throw new Error(`Partition key is required: ${partitionKey}`);
  }

  // Check for required GSI partition keys
  for (const {partitionKey: gsiPartitionKey} of gsiKeys) {
    if (isNullOrUndefined(data[gsiPartitionKey])) {
      throw new Error(`GSI partition key is required: ${gsiPartitionKey}`);
    }
  }

  // Check that all keys in 'data' exist in 'attributes'
  for (const key of Object.keys(data)) {
    if (!Object.values(attributes).some((attribute) => attribute.name === key)) {
      throw new Error(`Invalid attribute key: ${key}`);
    }
  }

  for (const [key, value] of Object.entries(data)) {
    const attribute = Object.values(attributes).find((attribute) => attribute.name === key);
    if (!attribute) {
      throw new Error(`Invalid attribute key: ${key}`);
    }
    if (!validateAttributeType(attribute, value)) {
      throw new Error(`Invalid attribute value type for key '${key}': ${typeof value}`);
    }
  }
  return true;
};

function validateQueryParams(schema, params) {
  const {partitionKey, sortKey} = schema;
  const {
    queryKey, queryValue, querySortKey, querySortValue,
    querySortStartValue, querySortEndValue,
  } = params;

  const gsiKeys = getGsiKeys(schema);
  const gsiKeyNames = gsiKeys.map((gsiKey) => gsiKey.partitionKey);
  const gsiSortKeyNames = gsiKeys.map((gsiKey) => gsiKey.sortKey);

  if (!queryKey || !queryValue) {
    throw new Error(`key and value are required`);
  }
  const isPartitionKey = partitionKey === queryKey;
  const isGsiPartitionKey = gsiKeyNames.includes(queryKey);

  if (!isPartitionKey && !isGsiPartitionKey) {
    throw new Error(`queryKey is invalid: ${queryKey}`);
  }

  if (isGsiPartitionKey) {
    const gsi = gsiKeys.find((gsiKey) => gsiKey.partitionKey === queryKey);
    params.indexName = gsi?.indexName;
    if (!params.indexName) {
      throw new Error(`indexName is required for GSI query: ${queryKey}`);
    }
  }

  if (querySortKey) {
    const isValidSortKey = querySortKey === sortKey || gsiSortKeyNames.includes(querySortKey);
    if (!isValidSortKey) {
      throw new Error(`querySortKey is invalid: ${querySortKey}`);
    }

    if (
      isNullOrUndefined(querySortValue) &&
      isNullOrUndefined(querySortStartValue) &&
      isNullOrUndefined(querySortEndValue)) {
      throw new Error(
        'Either querySortValue, querySortStartValue or querySortEndValue is required ' +
        'when querySortKey is provided');
    }
  }

  return params;
}

function validateUpdateParams(schema, params) {
  validateQueryParams(schema, params);

  if (!params.data) {
    throw new Error(`data is required`);
  }

  // Check that all keys in 'data' exist in 'attributes'
  for (const key of Object.keys(params.data)) {
    if (!Object.values(schema.attributes).some((attribute) => attribute.name === key)) {
      throw new Error(`Invalid attribute key: ${key}`);
    }
  }

  for (const [key, value] of Object.entries(params.data)) {
    const attribute = Object.values(schema.attributes).find((attribute) => attribute.name === key);
    if (!attribute) {
      throw new Error(`Invalid attribute key: ${key}`);
    }
    if (!validateAttributeType(attribute, value)) {
      throw new Error(`Invalid attribute value type for key '${key}': ${typeof value}`);
    }
  }
  return params;
};


export const getItem = async (schema, params) => {
  validateQueryParams(schema, params);

  try {
    const Key = {
      [params.queryKey]: params.queryValue,
    };
    if (params.querySortKey && params.querySortValue) {
      Key[params.querySortKey] = params.querySortValue;
    }
    const command = new GetCommand({
      TableName: schema.tableName,
      ...(isNotNullOrUndefined(params.indexName) ? {IndexName: params.indexName} : {}),
      Key,
    });
    const result = await docClient.send(command);
    return result.Item;
  } catch (err) {
    logger.error(`DynamoDB getItem error: ${err}`);
    throw err;
  }
};

export const queryItems = async (schema, params) => {
  validateQueryParams(schema, params);

  try {
    const keyConditionClauses = [`${params.queryKey} = :${params.queryKey}`];
    const expressionAttributeValues = {[`:${params.queryKey}`]: params.queryValue};
    if (params.querySortKey) {
      if (
        isNotNullOrUndefined(params.querySortValue)
      ) {
        keyConditionClauses.push(`${params.querySortKey} = :${params.querySortKey}`);
        expressionAttributeValues[`:${params.querySortKey}`] = params.querySortValue;
      } else if (
        isNotNullOrUndefined(params.querySortStartValue) &&
        isNotNullOrUndefined(params.querySortEndValue)) {
        keyConditionClauses.push(`${params.querySortKey}` +
          ` BETWEEN :${params.querySortKey}_START AND :${params.querySortKey}_END`);
        expressionAttributeValues[`:${params.querySortKey}_START`] = params.querySortStartValue;
        expressionAttributeValues[`:${params.querySortKey}_END`] = params.querySortEndValue;
      } else if (isNotNullOrUndefined(params.querySortStartValue)) {
        keyConditionClauses.push(`${params.querySortKey} >= :${params.querySortKey}_START`);
        expressionAttributeValues[`:${params.querySortKey}_START`] = params.querySortStartValue;
      } else if (isNotNullOrUndefined(params.querySortEndValue)) {
        keyConditionClauses.push(`${params.querySortKey} <= :${params.querySortKey}_END`);
        expressionAttributeValues[`:${params.querySortKey}_END`] = params.querySortEndValue;
      }
    }

    const command = new QueryCommand({
      TableName: schema.tableName,
      ...(isNotNullOrUndefined(params.indexName) ? {IndexName: params.indexName} : {}),
      KeyConditionExpression: keyConditionClauses.join(' AND '),
      ExpressionAttributeValues: expressionAttributeValues,
    });
    const result = await docClient.send(command);
    return result.Items;
  } catch (err) {
    logger.error(`DynamoDB queryItems error: ${err}`);
    throw err;
  }
};

export const scanItems = async (schema) => {
  try {
    const command = new ScanCommand({
      TableName: schema.tableName,
      // Optional: FilterExpression to filter results after the scan
      // FilterExpression: "attributeName = :value",
      // ExpressionAttributeValues: {
      //   ":value": "someValue",
      // },
      // Optional: ProjectExpression to specify which attributes to return
      // ProjectionExpression: 'attribute1, attribute2',
    });
    const result = await docClient.send(command);
    return result.Items;
  } catch (err) {
    logger.error(`DynamoDB scanItems error: ${inspect(err)}`);
    throw err;
  }
};

export const putItem = async (schema, data) => {
  validateAttributes(schema, data);

  try {
    // Get the current time in epoch second format
    const curTime = Math.floor(new Date().getTime() / 1000);

    // Calculate the expireAt time (3 hours from now) in epoch second format
    const expireAt = Math.floor((Date.now() + 3 * 60 * 60 * 1000) / 1000);

    // Create DynamoDB item using native JS types, not AttributeValue format.
    // DynamoDBDocumentClient (PutCommand) expects plain JS object.
    const item = {
      [schema.partitionKey]: data[schema.partitionKey],
      ...(isNotNullOrUndefined(schema.sortKey) ? {[schema.sortKey]: data[schema.sortKey]} : {}),
      ...Object.values(schema.attributes).reduce((acc, value) => {
        if (value.name !== schema.partitionKey && value.name !== schema.sortKey) {
          acc[value.name] = data[value.name];
        }
        return acc;
      }, {}),
      ...(schema.ttl !== null && schema.ttl !== undefined ? {[schema.ttl.name]: expireAt} : {}),
      createdAt: curTime,
      updatedAt: curTime,
    };

    const putItemCommand = new PutCommand({
      TableName: schema.tableName,
      Item: item,
      // Note: ProvisionedThroughput cannot be specified on PutItem; set it at table creation.
    });

    const result = await docClient.send(putItemCommand);
    return result;
  } catch (err) {
    logger.error(`DynamoDB putItem error: ${err}`);
    throw err;
  }
};

export const updateItem = async (schema, params) => {
  validateUpdateParams(schema, params);

  const expireAt = Math.floor((Date.now() + 90 * 24 * 60 * 60 * 1000) / 1000);

  // Make sure ExpressionAttributeValues are all un-marshalled, not native types
  const expressionAttributeValues = {};

  // Marshal each data attribute value
  Object.entries(params.data).forEach(([key, value]) => {
    expressionAttributeValues[`:${key}`] = value;
  });

  // Marshal TTL if present
  if (isNotNullOrUndefined(schema.ttl)) {
    expressionAttributeValues[`:${schema.ttl.name}`] = expireAt;
  }

  // Only marshal primitive types (not objects), throw otherwise
  Object.entries(expressionAttributeValues).forEach(([k, v]) => {
    if (typeof v === 'object' && v !== null) {
      throw new Error(`Invalid attribute value type for key '${k}': ${JSON.stringify(v)}`);
    }
  });

  const updatedAt = Math.floor(new Date().getTime() / 1000);

  if (!expressionAttributeValues[`:updatedAt`]) {
    expressionAttributeValues[`:updatedAt`] = updatedAt;
  }

  const updateItemCommand = new UpdateCommand({
    TableName: schema.tableName,
    ...(isNotNullOrUndefined(params.indexName) ? {IndexName: params.indexName} : {}),
    Key: {
      [params.queryKey]: params.queryValue,
      ...(isNotNullOrUndefined(params.querySortKey) ?
        {[params.querySortKey]: params.querySortValue} :
        isNotNullOrUndefined(params.querySortStartValue) ?
          {[`${params.querySortKey}_START`]: params.querySortStartValue} :
          isNotNullOrUndefined(params.querySortEndValue) ?
            {[`${params.querySortKey}_END`]: params.querySortEndValue} :
            {}),
    },
    UpdateExpression:
      `SET ${
        [
          ...Object.keys(params.data).map((key) => `${key} = :${key}`),
          'updatedAt = :updatedAt',
          ...(isNotNullOrUndefined(schema.ttl) ? [`${schema.ttl.name} = :${schema.ttl.name}`] : []),
        ].join(', ')
      }`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  });

  try {
    const result = await docClient.send(updateItemCommand);
    console.log(`result: ${JSON.stringify(result)}`);
    // AWS SDK v3 returns result.Attributes as native JS types (not DynamoDB type map)
    const responseData = result.Attributes;
    logger.info(`DynamoDB updateItem successfully: ${JSON.stringify(responseData)}`);
    return responseData;
  } catch (err) {
    logger.error(`DynamoDB updateItem error: ${err}`);
    throw err;
  }
};

export const deleteItem = async (schema, params) => {
  validateQueryParams(schema, params);
  try {
    const deleteItemCommand = new DeleteCommand({
      TableName: schema.tableName,
      ...(isNotNullOrUndefined(params.indexName) ? {IndexName: params.indexName} : {}),
      Key: {
        [params.queryKey]: params.queryValue,
        ...(isNotNullOrUndefined(params.querySortKey) ?
          {[params.querySortKey]: params.querySortValue} :
          isNotNullOrUndefined(params.querySortStartValue) ?
            {[`${params.querySortKey}_START`]: params.querySortStartValue} :
            isNotNullOrUndefined(params.querySortEndValue) ?
              {[`${params.querySortKey}_END`]: params.querySortEndValue} :
              {}),
      },
    });
    const result = await docClient.send(deleteItemCommand);
    return result;
  } catch (err) {
    logger.error(`DynamoDB deleteItem error: ${err}`);
    throw err;
  }
};

export const isDynamoDBConnected = () =>
  client.config.region !== undefined && client.config.credentials !== undefined;

export const closeDynamoDBConnection = () => {
  client.destroy();
};

export const deleteAllItems = async (schema) => {
  const {
    tableName, partitionKey, sortKey, // attributes, ttl,
  } = schema;

  try {
    // Scan to get all items' keys using for await for paginated scan
    let deletedCount = 0;
    let itrIdx = 0;

    // Async generator for Scan pagination
    async function* scanAllItems() {
      let lastEvaluatedKey;
      while (true) {
        const scanParams = {
          TableName: tableName,
          ProjectionExpression: isNotNullOrUndefined(sortKey) ?
            `${partitionKey}, ${sortKey}` : partitionKey,
          ExclusiveStartKey: lastEvaluatedKey,
        };
        // eslint-disable-next-line no-await-in-loop
        const result = await docClient.send(new ScanCommand(scanParams));
        if (result.Items && result.Items.length > 0) {
          yield result.Items;
        }
        if (result.LastEvaluatedKey) {
          lastEvaluatedKey = result.LastEvaluatedKey;
        } else {
          break;
        }
      }
    }

    for await (const items of scanAllItems()) {
      itrIdx++;
      console.log(`[${itrIdx}] found ${items.length} items to delete from ${tableName} table`);

      // Batch delete in batches of 25 (DynamoDB limit)
      const BATCH_SIZE = 25;
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        const deleteRequests = batch.map((item) => {
          const Key = {
            [partitionKey]: item[partitionKey],
            ...(sortKey !== null && sortKey !== undefined ? {[sortKey]: item[sortKey]} : {}),
          };
          return {DeleteRequest: {Key}};
        });

        const params = {
          RequestItems: {
            [tableName]: deleteRequests,
          },
        };

        console.log(`[${itrIdx}] deleted ${batch.length} items from ${tableName} table`);

        // eslint-disable-next-line no-await-in-loop
        await docClient.send(new BatchWriteCommand(params));
        deletedCount += batch.length;
      }
    }

    console.log(`DynamoDB - deleted ${deletedCount} items from ${tableName} table.`);
    return {deleted: deletedCount};
  } catch (err) {
    console.error(`DynamoDB - deleteAllItems error: ${err}`);
    throw err;
  }
};

export default {
  DynamoDBAttributeTypes,
  getItem,
  putItem,
  queryItems,
  scanItems,
  updateItem,
  isDynamoDBConnected,
  closeDynamoDBConnection,
  deleteItem,
  deleteAllItems,
};
