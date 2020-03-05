const { queues: { crashReports, crashReportsProcessing } } = require('./config');
const { wait } = require('./utils');
const validateCrashReport = require('./validate-crash-report');

// generator function so that we can treat the events as a stream
// therefore abstracting the polling of the queue
async function* pullCrashReport(redis, logger) {
  // the consumer will check for new crash reports continuously
  // can avoid this by notifying of new reports via a pub/sub channel
  while (true) {
    // atomically pop the queue and push to the processing list
    // another consumer will check the processing list and if an item is in the list
    // for more than <timeout> ms, then push it back in the crash reports queue because
    // the processor probably failed to process it
    const rawReport = await redis.rpoplpush(crashReports, crashReportsProcessing);

    if (rawReport != null) {
      logger.debug('found new report:', rawReport);
      yield rawReport;

      // remove the current report from the processing list
      // this won't be reached if processing fails
      await redis.lrem(crashReportsProcessing, 1, rawReport);
    } else {
      // do nothing for 100ms so that we don't keep the CPU at 100%
      // or overload the Redis instance
      await wait(100);
    }
  }
}

module.exports = pullCrashReport;
