/** @format */

import { FastifyMultipartOptions } from '@fastify/multipart';
import * as dotenv from 'dotenv';

dotenv.config();

// https://github.com/fastify/fastify-multipart

const multipartConfigList: Record<string, FastifyMultipartOptions> = {
  development: {
    limits: {
      fileSize: 1048576 * 5,
      files: 1
    }
  },
  production: {
    limits: {
      fileSize: 1048576 * 5,
      files: 1
    }
  }
};

export const multipartConfig: FastifyMultipartOptions = multipartConfigList[String(process.env.NODE_ENV)];
