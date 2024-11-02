/** @format */

import nsfwMethod from './nsfw';
import openaiMethod from './openai';
import type { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(nsfwMethod);
  fastify.register(openaiMethod);
}
