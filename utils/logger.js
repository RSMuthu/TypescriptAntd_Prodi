const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.json(),
    // not using splat() formatting
    // it can be used in the place of caller itself
    format.timestamp(),
    format.printf((info) => {
      // eslint-disable-next-line no-param-reassign
      info.request_ip = require('express-http-context').get('reqId');
      return info;
    }),
    format.prettyPrint(),
  ),
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV !== 'prod' ? 'debug' : 'info',
    }),
  ],
});

module.exports = logger;
