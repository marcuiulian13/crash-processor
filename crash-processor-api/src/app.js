const path = require('path');
const AutoLoad = require('fastify-autoload');
const redis = require('fastify-redis');

const { redis: redisConfig } = require('./config');

module.exports = (fastify, opts, next) => {
  // Place here your custom code!
  fastify.register(redis, redisConfig);

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // fastify.register(AutoLoad, {
  //   dir: path.join(__dirname, 'plugins'),
  //   options: { ...opts },
  // });

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: { ...opts },
  });

  // Make sure to call next when done
  next();
};
