/** @format */

import { FastifyCorsOptions } from '@fastify/cors';
import { config } from 'dotenv';

config({
  path: '.env.takabase-local',
  override: false
});

// https://github.com/fastify/fastify-cors

// prettier-ignore
const corsConfigList: Record<string, FastifyCorsOptions> = {
  localhost: {
    origin: [
      'http://localhost:4200',
      'http://localhost:4000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  development: {
    origin: [
      'https://takabase-dev.web.app',
      'https://takabase-dev.firebaseapp.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  production: {
    origin: [
      'https://takabase.com',
      'https://takabase-prod.web.app',
      'https://takabase-prod.firebaseapp.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
};

export const corsConfig: FastifyCorsOptions = corsConfigList[String(process.env.NODE_ENV)];
