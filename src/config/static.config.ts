/** @format */

import { FastifyStaticOptions } from '@fastify/static';
import { join } from 'path';

// https://github.com/fastify/fastify-static

export const staticConfig: FastifyStaticOptions = {
  root: join(__dirname, '../'),
  serve: false,
  wildcard: false
};
