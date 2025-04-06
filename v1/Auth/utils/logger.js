
import winston  from 'winston';


// Create a common format that includes timestamp and JSON formatting
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Console format with timestamp and readable format
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} ${level}: ${message} ${metaString}`;
  })
);

const logger = winston.createLogger({
  level: 'info',
  format: fileFormat,
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: 'info.log' , level: 'info'}),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//

  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));

  export default logger;