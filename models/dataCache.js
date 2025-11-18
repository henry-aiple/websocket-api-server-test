import mongoose from 'mongoose';
const {Schema} = mongoose;
import {TYPES, like} from '../src/helpers/assert.js';
import {inspect} from 'util';

import {getHoursAfter} from '../src/utils/timestamp.js';

const DataCacheSchema = new Schema({
  countryCode: String,
  type: String,
  data: Schema.Types.Mixed,
  expiredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const DataCache = mongoose.model('DataCache', DataCacheSchema, 'DataCache');

const keyToRemoved = ['_id', '__v'];

function normalize(val) {
  return val;
}

export const add = async (param) => {
  if (!like(param, {
    countryCode: TYPES.STRING.NONEMPTY,
    type: TYPES.STRING.NONEMPTY,
    data: TYPES.MIXED.NONEMPTY,
    createdAt: TYPES.DATE.NONEMPTY,
  })) throw new Error(`invalid param to add data cache: ${inspect(param)}`);

  const expiredAt = getHoursAfter(param.createdAt, 3);

  const dataCache = normalize(
    await DataCache
      .findOneAndUpdate(
        {
          countryCode: param.countryCode,
          type: param.type,
        },
        {
          countryCode: param.countryCode,
          data: param.data,
          expiredAt,
          createdAt: param.createdAt,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .lean()
      .exec(),
  );

  Object.keys(dataCache)
    .filter((key) => keyToRemoved.includes(key))
    .forEach((key) => delete dataCache[`${key}`]);

  return dataCache;
};

export const getValidByCountryCodeAndType = async (countryCode, type) => {
  if (!like(countryCode, TYPES.STRING.NONEMPTY)) {
    throw new Error(`invalid countryCode to get data cache: ${countryCode}`);
  }
  if (!like(type, TYPES.STRING.NONEMPTY)) {
    throw new Error(`invalid type to get data cache: ${type}`);
  }

  const currentTime = new Date();

  return normalize(
    await DataCache
      .findOne({
        countryCode,
        type,
        expiredAt: {$gte: currentTime},
      }, {_id: 0, __v: 0})
      .lean()
      .exec(),
  );
};

export default {
  add,
  getValidByCountryCodeAndType,
};
