/** @format */

import type { FastifyCompressOptions } from '@fastify/compress';

// https://github.com/fastify/fastify-compress

export const compressConfig: FastifyCompressOptions = {
  global: true,
  threshold: 1024
};
