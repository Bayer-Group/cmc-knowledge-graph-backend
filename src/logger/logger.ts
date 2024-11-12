const winston = require('winston');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: 'Knowledge Graph Explorer API' },
  transports: [
    new winston.transports.Console()
  ],
});

export default logger;