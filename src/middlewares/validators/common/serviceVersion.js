/* eslint-disable max-len */
import {validate, Joi} from 'express-validation';

/**
 * Service Version
 */
const serviceVersionQuerySchema = {
  query: Joi.object({
    platform: Joi.string()
      .lowercase()
      .valid('ios', 'android')
      .required(),
  }),
};

export const serviceVersionQuery = validate(serviceVersionQuerySchema, {context: true, keyByField: true}, {});
