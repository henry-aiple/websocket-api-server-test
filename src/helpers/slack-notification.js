import config from '../tools/config.js';
import logger from '../tools/logger.js';
import axios from 'axios';

import AsciiTable from 'ascii-table';

// import {parseLocale} from '../utils/locale.js';
// import {truncateString} from '../utils/util.js';
// import {getPreferredLocaleFromUser} from '../utils/locale.js';

// import {roundToTwoDecimals} from '../utils/util.js';

const SLACK_CHANNEL_TYPE = {
  TIKTOK_RESEARCH_REQ: 'tiktokResearchReq',
  TIKTOK_RESEARCH_DONE: 'tiktokResearchDone',
  TIKTOK_CUSTOM: 'tiktokCustom',
  BEESIR: 'beesir',
};

async function sendSlackNotification(channelType, block) {
  const slackMessage = {
    'channel': config.slack[channelType].slackChannel,
    'username': 'Sparkr-API',
    // 'icon_emoji': ':wave:',
    ...block,
  };

  const sendToSlack = async () => {
    try {
      await axios.post(
        `${config.slack.baseHookUrl}${config.slack[channelType].hookUrl}`,
        JSON.stringify(slackMessage),
      );
      logger.info(`Message posted to ${slackMessage.channel}`);
    } catch (err) {
      logger.error(`Request failed: ${err}`);
    }
  };

  if (config.env === 'test') {
    console.log(`send slack notification: ${JSON.stringify(slackMessage)}`);
    // await sendToSlack();
    return;
  }

  return sendToSlack();
}

function getNewResearchReqBlock(research) {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:500won: *New TikTok Research Request* - ${config.env}`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Email*: ${research.input.email}\n` +
            `*AccountId*: ${research.input.tiktokAccountId}\n` +
            `*Keywords*: ${research.input.keywords.join(', ')}\n` +
            `*CountryCode*: ${research.input.countryCode}\n` +
            `*RequestedAt*: ${research.requestedAt.toISOString()}\n`,
          verbatim: true,
        },
      },
      {
        type: 'divider',
      },
    ],
  };
}

export const notifyNewResearchReq = async (research) =>
  sendSlackNotification(
    SLACK_CHANNEL_TYPE.TIKTOK_RESEARCH_REQ,
    getNewResearchReqBlock(research),
  );

function getCustomEventBlock(appName, eventName, data) {
  const table = new AsciiTable()
    .setHeading('Key', 'Value');

  Object.entries(data).forEach(([key, value]) => {
    table.addRow(key, value);
  });

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `${appName}: ${eventName} - ${config.env}`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: table.toString(),
          verbatim: true,
        },
      },
      {
        type: 'divider',
      },
    ],
  };
}

export const notifyCustomEventBlock = async (appName, eventName, data) =>
  sendSlackNotification(
    SLACK_CHANNEL_TYPE.TIKTOK_CUSTOM,
    getCustomEventBlock(appName, eventName, data),
  );


function getNewResearchDoneBlock(research) {
  const reportUrl =
    `${config.webClient.baseUrl}${
      config.webClient.reportEndpoint.replace('${researchId}', research.researchId)
    }`;

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:rolled_up_newspaper: *New TikTok Research Done* - ${config.env}`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Email*: ${research.input.email}\n` +
            `*AccountId*: ${research.input.tiktokAccountId}\n` +
            `*Keywords*: ${research.input.keywords.join(', ')}\n` +
            `*CountryCode*: ${research.input.countryCode}\n` +
            `*RequestedAt*: ${research.requestedAt.toISOString()}\n`,
          verbatim: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*ResearchId*: ${research.researchId}\n` +
            `*Status*: ${research.status}\n` +
            `*CompletedAt*: ${research.completedAt.toISOString()}\n`,
          verbatim: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'View Report',
            },
            url: reportUrl,
          },
        ],
      },
      {
        type: 'divider',
      },
    ],
  };
}

export const notifyNewResearchDone = async (research) =>
  sendSlackNotification(
    SLACK_CHANNEL_TYPE.TIKTOK_RESEARCH_DONE,
    getNewResearchDoneBlock(research),
  );


// Beesir

function getBeesirNewUserBlock(email, username) {
  const table = new AsciiTable()
    .setHeading('Email', 'Username')
    .addRow(email, username)
    .toString();

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:bee::raised_hands: *Beesir New User* - ${config.env}`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: table,
          verbatim: true,
        },
      },
      {
        type: 'divider',
      },
    ],
  };
}

export const notifyBeesirNewUser = async (email, username) =>
  sendSlackNotification(
    SLACK_CHANNEL_TYPE.BEESIR,
    getBeesirNewUserBlock(email, username),
  );

function getBeesirUsernameCheckBlock(username, result) {
  const table = new AsciiTable()
    .setHeading('Username', 'Result')
    .addRow(username, result)
    .toString();

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:bee::thinking_face: *Beesir Username Check* - ${config.env}`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: table,
          verbatim: true,
        },
      },
      {
        type: 'divider',
      },
    ],
  };
}

export const notifyBeesirUsernameCheck = async (username, result) =>
  sendSlackNotification(
    SLACK_CHANNEL_TYPE.BEESIR,
    getBeesirUsernameCheckBlock(username, result),
  );

export default {
  notifyNewResearchReq,
  notifyNewResearchDone,
  notifyCustomEventBlock,
  notifyBeesirNewUser,
  notifyBeesirUsernameCheck,
};
