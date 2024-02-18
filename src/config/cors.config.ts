/** @format */

import { FastifyCorsOptions } from '@fastify/cors';
import * as dotenv from 'dotenv';

dotenv.config();

// https://github.com/fastify/fastify-cors

const corsConfigList: Record<string, FastifyCorsOptions> = {
  localhost: {
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  development: {
    origin: ['https://takabase-dev.web.app', 'https://takabase-dev.firebaseapp.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  production: {
    origin: ['https://takabase-prod.web.app', 'https://takabase-prod.firebaseapp.com', 'https://takabase.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
};

export const corsConfig: FastifyCorsOptions = corsConfigList[String(process.env.NODE_ENV)];
