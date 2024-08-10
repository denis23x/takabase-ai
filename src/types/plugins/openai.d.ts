/** @format */

import type OpenAI from 'openai';

declare module 'fastify' {
  interface FastifyInstance {
    openai: OpenAI;
  }
}

export {};
