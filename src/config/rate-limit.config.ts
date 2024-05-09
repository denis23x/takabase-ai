/** @format */

import { FastifyRateLimitOptions } from '@fastify/rate-limit';
import { config } from 'dotenv';

config({
  path: '.env.takabase-local',
  override: false
});

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

export const rateLimitConfig: FastifyRateLimitOptions = rateLimitConfigList[String(process.env.APP_NODE_ENV)];
