import mongoose from 'mongoose';
const {Schema} = mongoose;
import {TYPES, like} from '../src/helpers/assert.js';
import {inspect} from 'util';

import {getDaysBefore} from '../src/utils/timestamp.js';

const ResearchSchema = new Schema({
  researchId: {
    type: String,
    unique: true,
  },
  input: {
    email: String,
    tiktokAccountId: String,
    keywords: [String],
    countryCode: String,
  },
  output: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: 'QUEUED',
  },
  requestedAt: Date,
  completedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ChatSchema.index({chatId: 1}, {unique: true});

export const Research = mongoose.model('Research', ResearchSchema, 'Research');

const keyToRemoved = ['_id', '__v'];

function normalize(val) {
  return val;
}

export const add = async (param) => {
  if (!like(param, {
    researchId: TYPES.STRING.NONEMPTY,
    input: TYPES.OBJECT.NONEMPTY,
    requestedAt: TYPES.DATE.NONEMPTY,
  })) throw new Error(`invalid param to add research: ${inspect(param)}`);

  if (!like(param.input, {
    email: TYPES.STRING.NONEMPTY,
    tiktokAccountId: TYPES.STRING.NONEMPTY,
    keywords: TYPES.ARRAY.NONEMPTY,
    countryCode: TYPES.STRING.NONEMPTY,
  })) throw new Error(`invalid param to add research: ${inspect(param)}`);

  const research = normalize(
    await Research
      .findOneAndUpdate(
        {
          researchId: param.researchId,
        },
        {
          researchId: param.researchId,
          input: param.input,
          requestedAt: param.requestedAt,
          createdAt: param.requestedAt,
        },
        {
          upsert: true,
          new: true,
        },
      )
      .lean()
      .exec(),
  );

  Object.keys(research)
    .filter((key) => keyToRemoved.includes(key))
    .forEach((key) => delete research[`${key}`]);

  return research;
};


export const set = async (param) => {
  if (!like(
    param,
    {
      researchId: TYPES.STRING.NONEMPTY,
      output: TYPES.STRING.NONEMPTY,
      completedAt: TYPES.DATE.NONEMPTY,
    },
  )) throw new Error(`invalid param to set research: ${param}`);

  const {
    researchId, output, completedAt,
  } = param;

  const toSet = {
    output,
    status: 'COMPLETED',
    completedAt,
  };

  const research = normalize(
    await Research
      .findOneAndUpdate(
        {
          researchId,
        },
        {
          $set: toSet,
        },
        {new: true},
      )
      .lean()
      .exec(),
  );

  Object.keys(research)
    .filter((key) => keyToRemoved.includes(key))
    .forEach((key) => delete research[key]);

  return research;
};

export const getById = async (researchId) => {
  if (!like(researchId, TYPES.STRING.NONEMPTY)) {
    throw new Error(`invalid researchId to get research: ${researchId}`);
  }

  return normalize(
    await Research
      .findOne({researchId}, {_id: 0, __v: 0})
      .lean()
      .exec(),
  );
};

export const getCountCompletedByEmailPerOneDay = async (email) => {
  const currentTime = new Date();
  const oneDayAgo = getDaysBefore(currentTime, 1);

  const count = await Research.countDocuments({
    'input.email': email,
    'requestedAt': {
      $gte: oneDayAgo,
    },
    'status': 'COMPLETED',
  });

  return count;
};

export const getCountryCodeRequestedPerOneWeek = async () => {
  const currentTime = new Date();
  const oneWeekAgo = getDaysBefore(currentTime, 7);


  const countryCodeRequested = (
    await Research
      .find({requestedAt: {$gte: oneWeekAgo}}, {_id: 0, __v: 0})
      .lean()
      .exec()
  ).map(normalize);

  return countryCodeRequested?.length ?
    [...new Set(countryCodeRequested.map((research) => research.input.countryCode))] :
    [];
};

export default {
  add,
  set,
  getById,
  getCountCompletedByEmailPerOneDay,
  getCountryCodeRequestedPerOneWeek,
};
