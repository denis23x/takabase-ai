/** @format */

import { FastifyRateLimitOptions } from '@fastify/rate-limit';
import * as dotenv from 'dotenv';

dotenv.config();

// https://github.com/fastify/fastify-rate-limit

const rateLimitConfigList: Record<string, FastifyRateLimitOptions> = {
  localhost: {
    max: 1000,
    timeWindow: '1 minute'
  },
  development: {
    max: 500,
    timeWindow: '1 minute'
  },
  production: {
    max: 500,
    timeWindow: '1 minute'
  }
};

export const rateLimitConfig: FastifyRateLimitOptions = rateLimitConfigList[String(process.env.NODE_ENV)];
