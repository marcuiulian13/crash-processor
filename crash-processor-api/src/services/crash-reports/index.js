const { queues: { crashReports } } = require('../../config');
const {
  getInvalidKey, getErrorKey, getWarnKey, getInfoKey,
} = require('../../utils');

module.exports = async (fastify, opts) => {
  fastify.post('/crash-reports', async (req, reply) => {
    const { redis } = fastify;

    try {
      const report = JSON.stringify(req.body);

      await redis.lpush(crashReports, report);
      req.log.debug('pushed crash report', report);

      return reply.code(202).send();
    } catch (e) {
      req.log.error(e);
      return reply.code(500).send();
    }
  });

  fastify.get('/crash-reports/:projectId', async (req, reply) => {
    const { redis } = fastify;
    const { params: { projectId } } = req;

    const invalidCount = await redis.get(getInvalidKey(projectId));
    const errorCount = await redis.get(getErrorKey(projectId));
    const warnCount = await redis.get(getWarnKey(projectId));
    const infoCount = await redis.get(getInfoKey(projectId));

    return {
      invalid: invalidCount ? Number(invalidCount) : 0,
      error: errorCount ? Number(errorCount) : 0,
      warn: warnCount ? Number(warnCount) : 0,
      info: infoCount ? Number(infoCount) : 0,
    };
  });
};
