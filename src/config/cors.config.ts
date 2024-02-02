/** @format */

import { FastifyCorsOptions } from '@fastify/cors';
import * as dotenv from 'dotenv';

dotenv.config();

// https://github.com/fastify/fastify-cors

const corsConfigList: Record<string, FastifyCorsOptions> = {
  development: {
    origin: ['http://localhost:4200', 'http://localhost:4000', 'http://172.20.10.5:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  production: {
    origin: ['http://localhost:4200', 'http://localhost:4000', 'https://draft-ssr.web.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
};

export const corsConfig: FastifyCorsOptions = corsConfigList[String(process.env.NODE_ENV)];
