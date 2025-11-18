import {SESClient, SendTemplatedEmailCommand} from '@aws-sdk/client-ses';

import config from '../../tools/config.js';
import logger from '../../tools/logger.js';

// Create SES service object.
const client = new SESClient(config.aws.clientCfg);

import {v4 as uuidv4} from 'uuid';

// Create Template
// $ aws --region ap-northeast-2 ses create-template --cli-input-json file://UnswtGreeting.json
// Delete Template
// $ aws --region ap-northeast-2 ses delete-template --template-name testGreetingTemplate

const getUniqueName = (name) => `${uuidv4()}-${name.toLowerCase()}`;
const getNoReplyName = (name) => `${name.toLowerCase()}-no-reply`;

const postfix = (source, str) => {
  if (typeof str !== 'string') {
    throw new Error('Cannot postfix a non-string value.');
  }
  return `${source}${str}`;
};

export const getVerifiedUniqueEmail = () => postfix(getUniqueName('team'), '@aiple.co');
export const getNoReplyEmail = () => postfix(getNoReplyName('unswt-team'), '@aiple.co');
export const getTeamEmail = () => postfix('team', '@aiple.co');

export const createTemplatedEmailCommand = (toEmailAddrs, fromEmail, templateName, templateData) =>
  new SendTemplatedEmailCommand({
    /**
     * Here's an example of how a template would be replaced with user data:
     * Template: <h1>Hello {{contact.firstName}},</h1><p>Don't forget about the party gifts!</p>
     * Destination: <h1>Hello Bilbo,</h1><p>Don't forget about the party gifts!</p>
     */
    Destination: {ToAddresses: [...toEmailAddrs]},
    Source: fromEmail,
    Template: templateName,
    TemplateData: templateData,
  });

export const sendEmail = async (command) => {
  try {
    return await client.send(command);
  } catch (err) {
    logger.error(`Failed to send user greeting email: ${err}`);
    return err;
  }
};

export default {
  getVerifiedUniqueEmail,
  getNoReplyEmail,
  getTeamEmail,
  createTemplatedEmailCommand,
  sendEmail,
};
