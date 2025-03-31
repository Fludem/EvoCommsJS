import pino from 'pino';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BETTERSTACK_TOKEN;
const endpoint = process.env.BETTERSTACK_ENDPOINT;
const logLevel = process.env.LOG_LEVEL || 'info';

if (!token) {
  console.warn('BETTERSTACK_TOKEN not set. Logging to console only.');
}

let logger: pino.Logger;

const loggerConfig = {
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    env: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version,
  },
};

// Configure pretty console formatting options
const prettyConsoleOptions = {
  translateTime: 'dd-mm-yy HH:MM:ss',
  colorize: true,
  include: 'level,time'
};

if (token) {
  const transport = pino.transport({
    targets: [
      {
        target: 'pino-pretty',
        options: {
          ...prettyConsoleOptions,
          destination: 1, // stdout
        },
        level: logLevel
      },
      {
        target: '@logtail/pino',
        options: {
          sourceToken: token,
          ...(endpoint ? { options: { endpoint } } : {}),
        },
        level: logLevel
      }
    ]
  });

  logger = pino(loggerConfig, transport);
} else {
  const transport = pino.transport({
    target: 'pino-pretty',
    options: {
      ...prettyConsoleOptions,
      destination: 1, // stdout
    },
    level: logLevel
  });
  
  logger = pino(loggerConfig, transport);
}

export function createLogger(namespace: string) {
  return logger.child({ namespace });
}

export default logger; 