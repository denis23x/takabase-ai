/** @format */

import { FastifyHelmetOptions } from '@fastify/helmet';

// https://github.com/fastify/fastify-helmet

const helmetConfigList: Record<string, FastifyHelmetOptions> = {
  localhost: {
    global: true,
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    },
    contentSecurityPolicy: false
  },
  development: {
    global: true
  },
  production: {
    global: true
  }
};

export const helmetConfig: FastifyHelmetOptions = helmetConfigList[String(process.env.APP_NODE_ENV)];
