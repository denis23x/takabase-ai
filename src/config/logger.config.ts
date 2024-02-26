/** @format */

import { PinoLoggerOptions } from 'fastify/types/logger';
import * as dotenv from 'dotenv';

dotenv.config();

const loggerConfigList: Record<string, PinoLoggerOptions | boolean> = {
  localhost: {
    level: 'debug'
  },
  development: {
    level: 'error'
  },
  production: {
    level: 'error'
  }
};

export const loggerConfig: PinoLoggerOptions | boolean = loggerConfigList[String(process.env.NODE_ENV)];
