/** @format */

import { PinoLoggerOptions } from 'fastify/types/logger';
import * as dotenv from 'dotenv';

dotenv.config();

const loggerConfigList: Record<string, PinoLoggerOptions | boolean> = {
  development: {
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
  production: true
};

export const loggerConfig: PinoLoggerOptions | boolean = loggerConfigList[String(process.env.NODE_ENV)];
