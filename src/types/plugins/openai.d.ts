/** @format */

import OpenAI from 'openai';

declare module 'fastify' {
  interface FastifyInstance {
    openai: OpenAI;
  }
}

export {};
