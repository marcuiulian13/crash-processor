const Joi = require('@hapi/joi');

const reportSchema = Joi.object({
  projectId: Joi.string().required(),
  severity: Joi.string().optional().allow('error', 'warning', 'info').default('error'),
  message: Joi.string().required(),
  stacktrace: Joi.array().items(Joi.object({
    file: Joi.string().required(),
    method: Joi.string().required(),
    line: Joi.number().integer().optional(),
  })),
  metadata: Joi.object().optional(),
});

const reportWithProjectIdSchema = Joi.object({
  projectId: Joi.string().required(),
});

const validateCrashReport = (rawReport) => {
  try {
    JSON.parse(rawReport);
  } catch (e) {
    // follows the same shape as Joi returns for validation
    return { value: {}, error: 'report is not in JSON format' };
  }

  const report = JSON.parse(rawReport);
  const validationResult = reportSchema.validate(report, { allowUnknown: false });

  return validationResult;
};

const validateCrashReportHasProjectId = (rawReport) => {
  try {
    JSON.parse(rawReport);
  } catch (e) {
    // follows the same shape as Joi returns for validation
    return { value: {}, error: 'report is not in JSON format' };
  }

  const report = JSON.parse(rawReport);
  const validationResult = reportWithProjectIdSchema.validate(report, { allowUnknown: true });

  return validationResult;
};

module.exports = { validateCrashReport, validateCrashReportHasProjectId };
