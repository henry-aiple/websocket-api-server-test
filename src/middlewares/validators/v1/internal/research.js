/* eslint-disable max-len */
import {validate, Joi} from 'express-validation';

/**
 * Internal Research
 */
const intResearchBodySchema = {
  body: Joi.object({
    researchId: Joi.string()
      .guid({version: 'uuidv4'})
      .required(),
    output: Joi.string()
      .required(),
  }),
};

export const intResearchBody = validate(intResearchBodySchema, {context: true, keyByField: true}, {});
