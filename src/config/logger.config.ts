/** @format */

import { PinoLoggerOptions } from 'fastify/types/logger';
import * as dotenv from 'dotenv';

dotenv.config();

const loggerConfigList: Record<string, PinoLoggerOptions | boolean> = {
  localhost: {
    level: 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        ignore: 'pid,hostname',
        colorize: true,
        colorizeObjects: true
      }
    }
  },
  development: {
    level: 'error'
  },
  production: {
    level: 'error'
  }
};

export const loggerConfig: PinoLoggerOptions | boolean = loggerConfigList[String(process.env.NODE_ENV)];
