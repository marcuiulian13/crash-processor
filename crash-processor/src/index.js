require('dotenv').config();

const Redis = require('ioredis');
const logger = require('pino')({ level: process.env.DEBUG ? 'debug' : 'info' });

const { redis: redisConfig } = require('./config');
const pullCrashReport = require('./pull-crash-report');
const processCrashReport = require('./process-crash-report');

const start = async () => {
  logger.info('Crash report consumer started');

  const redis = new Redis(redisConfig);

  const processor = pullCrashReport(redis, logger);
  for await (const rawReport of processor) {
    await processCrashReport(rawReport, redis, logger);
  }
};

start().catch(e => {
  const errorLog = e.stack ? e.stack.split('\n').slice(0, 5).join('\n') : e.message;
  logger.error(errorLog);
  process.exit(1);
});
