const { validateCrashReport, validateCrashReportHasProjectId } = require('./validate-crash-report');
const {
  wait, getInvalidKey, getErrorKey, getWarnKey, getInfoKey,
} = require('./utils');

const updateProjectStats = async (crashReport, redis, logger) => {
  const { projectId } = crashReport;

  switch (crashReport.severity) {
    case 'error':
      // increment the amount of invalid messages on the project
      await redis.incr(getErrorKey(projectId));
      logger.debug('incremented error count for project', projectId);
      break;
    case 'warn':
      // increment the amount of invalid messages on the project
      await redis.incr(getWarnKey(projectId));
      logger.debug('incremented warn count for project', projectId);
      break;
    case 'info':
      // increment the amount of invalid messages on the project
      await redis.incr(getInfoKey(projectId));
      logger.debug('incremented info count for project', projectId);
      break;
    default:
  }
};

const processCrashReport = async (rawReport, redis, logger) => {
  // validate that the raw string is a json and is having the projectId
  const {
    error: projectIdError,
  } = validateCrashReportHasProjectId(rawReport);

  if (projectIdError) {
    logger.warn('project id validation failed for crash report', projectIdError);
    return;
  }

  // validate that the report matches the required schema
  const {
    value: crashReport,
    error: crashReportError,
  } = validateCrashReport(rawReport);

  const { projectId } = crashReport;

  if (crashReportError) {
    logger.info('invalid crash report', crashReportError);

    // increment the amount of invalid messages on the project
    await redis.incr(getInvalidKey(projectId));
    logger.debug('incremented invalid count for project', projectId);

    return;
  }

  await updateProjectStats(crashReport, redis, logger);
};

module.exports = processCrashReport;
