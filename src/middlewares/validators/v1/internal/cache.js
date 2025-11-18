import {validate, Joi} from 'express-validation';
import {COUNTRIES_IN_ALPHA2} from '../../../../constants/countryCode.js';

/**
 * Internal Cache
 */
const intCacheQuerySchema = {
  query: Joi.object({
    countryCode: Joi.string()
      .valid(...COUNTRIES_IN_ALPHA2)
      .required(),
    type: Joi.string()
      // .valid(...DATA_CACHE_TYPE_LIST)
      .required(),
  }),
};

export const intCacheQuery = validate(intCacheQuerySchema, {context: true, keyByField: true}, {});

const intCacheBodySchema = {
  body: Joi.object({
    countryCode: Joi.string()
      .valid(...COUNTRIES_IN_ALPHA2)
      .required(),
    type: Joi.string()
      // .valid(...DATA_CACHE_TYPE_LIST)
      .required(),
    data: Joi.alternatives().try(
      Joi.object().required(),
      Joi.array().items(
        Joi.object().required(),
      )
        .required(),
    )
      .required(),
  }),
};

export const intCacheBody = validate(intCacheBodySchema, {context: true, keyByField: true}, {});
