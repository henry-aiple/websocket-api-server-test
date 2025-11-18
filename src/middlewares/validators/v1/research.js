import {validate, Joi} from 'express-validation';
import {COUNTRIES_IN_ALPHA2} from '../../../constants/countryCode.js';

/**
 * Research
 */
const researchBodySchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    tiktokAccountId: Joi.string()
      .pattern(/^@?[A-Za-z0-9._]{4,24}$/)
      .min(4)
      .max(24)
      .custom((value, helpers) => {
        if (value.endsWith('.')) {
          return helpers.error(
            'string.pattern.base',
            {value: 'TikTok account ID cannot end with a dot'},
          );
        }
        return value.startsWith('@') ? value.slice(1) : value;
      })
      .required(),
    keywords: Joi.array().items(
      Joi.string()
        .allow('')
        .required(),
    )
      .custom((value, helpers) => {
        if (
          !Array.isArray(value) ||
          value.length === 0 ||
          typeof value[0] !== 'string' ||
          value[0].trim() === ''
        ) {
          return helpers.error(
            'any.invalid',
            {message: 'The first keyword must be a non-empty string'},
          );
        }
        return value;
      })
      .required(),
    countryCode: Joi.string()
      .valid(...COUNTRIES_IN_ALPHA2)
      .optional()
      .default('US'),
  }),
};

export const researchBody = validate(researchBodySchema, {context: true, keyByField: true}, {});
