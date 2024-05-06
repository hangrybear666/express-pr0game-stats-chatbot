import { Logger, createLogger, format, transports } from 'winston';
import { sendBasicAdminTelegramMessage, sendErrorAdminTelegramMessage, sendWarnAdminTelegramMessage } from './telegramAdminNotificationBot';
const colorizer = format.colorize();
const LEVEL = Symbol.for('level');

/**
 * Filters specific transports to only include provided `level`.
 */
function filterOnly(level: string) {
  return format(function (info) {
    if (info[LEVEL] === level) {
      return info;
    } else {
      return false;
    }
  })();
}

const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  playerStats: 4,
  verbose: 5,
  debug: 6
};

// Extend Logger interface to include custom log levels
interface CustomLogger extends Logger {
  playerStats: (message: string) => void;
}

const logger = createLogger({
  level: 'info',
  // DEFAULTS: error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
  levels: customLevels,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf((info) => `${info.level}: ${info.message ? String(info.message).trim() : null} at ${info.timestamp}`)
  ),
  // defaultMeta: { service: 'user-service' }, // define own metadata to be added
  transports: [
    // - Write all logs with importance level of `error` to `error.log`
    // - Write all logs with importance level of `info` or less to `info.log`
    // - Write all logs with importance level of `verbose` or less to `trace.log`
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/info.log', level: 'info' }),
    new transports.File({ filename: 'logs/trace.log', level: 'debug' }),
    // Filter and apply logic to only error level.
    new transports.Stream({
      level: 'info',
      format: filterOnly('info'),
      stream: process.stdout,
      log(info, next) {
        sendBasicAdminTelegramMessage(info.message);
        next();
      }
    }),
    // Filter and apply logic to only warn level.
    new transports.Stream({
      level: 'warn',
      format: filterOnly('warn'),
      stream: process.stdout,
      log(info, next) {
        sendWarnAdminTelegramMessage(info.message);
        next();
      }
    }),
    // Filter and apply logic to only error level.
    new transports.Stream({
      level: 'error',
      format: filterOnly('error'),
      stream: process.stdout,
      log(info, next) {
        sendErrorAdminTelegramMessage(info.message);
        next();
      }
    }),
    // Colorful Console logging for verbose and above.
    new transports.Console({
      level: 'verbose',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.colorize({
          level: true,
          message: false,
          // Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
          // Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey
          // Background colors: blackBG, redBG, greenBG, yellowBG, blueBG magentaBG, cyanBG, whiteBG
          colors: {
            info: 'bold blue blackBG',
            warn: 'italic yellow',
            error: 'bold red',
            http: 'inverse italic grey',
            verbose: 'dim grey',
            playerStats: 'italic cyan',
            timestamp: 'dim green blackBG'
          }
        }),
        format.printf((info) => {
          return `${info.level}: ${info.message ? String(info.message).trim() : null} ${colorizer.colorize('timestamp', info.timestamp)}`;
        })
      )
    })
  ]
}) as CustomLogger;

export { logger };
