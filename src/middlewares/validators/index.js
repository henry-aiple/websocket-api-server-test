// common
import {
  serviceVersionQuery,
} from './common/serviceVersion.js';

// v1 internal
import {
  intCacheQuery,
  intCacheBody,
} from './v1/internal/cache.js';

import {
  intResearchBody,
} from './v1/internal/research.js';

import {
  intSlackNotifBody,
} from './v1/internal/slack-notif.js';

// v1
import {
  researchBody,
} from './v1/research.js';

export default {
  // common
  serviceVersionQuery,

  // v1 internal cache
  intCacheQuery,
  intCacheBody,

  // v1 internal research
  intResearchBody,

  // v1 internal slack notif
  intSlackNotifBody,

  // v1 research
  researchBody,
};
