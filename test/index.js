import healthTest from './controllers/common/health.spec.js';
import serviceVersionTest from './controllers/common/serviceVersion.spec.js';

// import v1InternalCacheTest from './controllers/v1/internal/cache.spec.js';
// import v1InternalResearchTest from './controllers/v1/internal/research.spec.js';
// import v1InternalSlackNotifTest from './controllers/v1/internal/slack-notif.spec.js';

// import v1SlackNotifTest from './controllers/v1/slack-notif.spec.js';
// import v1ResearchTest from './controllers/v1/research.spec.js';

async function run() {
  /* Common */
  healthTest();
  serviceVersionTest();

  // /* V1 Internal */
  // v1InternalCacheTest();
  // v1InternalResearchTest();
  // v1InternalSlackNotifTest();

  // /* V1 */
  // v1SlackNotifTest();
  // v1ResearchTest();
}

run();
