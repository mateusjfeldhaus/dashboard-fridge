import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  // In dev, use pino-pretty for human-readable output.
  // In production (Railway), emit JSON so the log aggregator can parse it.
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:HH:MM:ss', ignore: 'pid,hostname' } }
    : undefined,
});

export default logger;
