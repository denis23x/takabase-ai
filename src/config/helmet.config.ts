/** @format */

import { FastifyHelmetOptions } from '@fastify/helmet';

// https://github.com/fastify/fastify-helmet

export const helmetConfig: FastifyHelmetOptions = {
  global: true,
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
};
