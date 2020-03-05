const { getEnv } = require('./utils');

module.exports = {
  redis: {
    host: getEnv('REDIS_HOST'),
    port: getEnv('REDIS_PORT'),
    password: getEnv('REDIS_PASSWORD'),
  },
  queues: {
    crashReports: getEnv('CRASH_REPORTS_QUEUE'),
    crashReportsProcessing: getEnv('CRASH_REPORTS_PROCESSING_QUEUE'),
  },
};
