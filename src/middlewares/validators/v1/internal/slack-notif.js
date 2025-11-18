import {validate, Joi} from 'express-validation';

/**
 * Internal Slack Notif
 */
const intSlackNotifBodySchema = {
  body: Joi.object({
    appName: Joi.string()
      .min(1)
      .required(),
    eventName: Joi.string()
      .min(1)
      .required(),
    data: Joi.object()
      .required(),
  }),
};

export const intSlackNotifBody =
  validate(intSlackNotifBodySchema, {context: true, keyByField: true}, {});
