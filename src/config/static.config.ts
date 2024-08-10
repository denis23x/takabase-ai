/** @format */

import { join } from 'path';
import type { FastifyStaticOptions } from '@fastify/static';

// https://github.com/fastify/fastify-static

export const staticConfig: FastifyStaticOptions = {
  root: join(__dirname, '../'),
  serve: false,
  wildcard: false
};
