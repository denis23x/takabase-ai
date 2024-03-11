/** @format */

import { FastifyEnvOptions } from '@fastify/env';

// https://github.com/fastify/fastify-env

export const envConfig: FastifyEnvOptions = {
  confKey: 'config',
  schema: {
    type: 'object',
    required: ['OPENAI_API_KEY'],
    properties: {
      NODE_ENV: {
        type: 'string',
        default: 'localhost'
      },
      APP_PORT: {
        type: 'number',
        default: 5000
      },
      APP_HOST: {
        type: 'string',
        default: 'localhost'
      },
      OPENAI_API_KEY: {
        type: 'string',
        default: 'key'
      }
    }
  },
  dotenv: true,
  data: process.env
};
