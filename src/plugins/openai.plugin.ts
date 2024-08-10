/** @format */

import fp from 'fastify-plugin';
import OpenAI from 'openai';
import { openaiConfig } from '../config/openai.config';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const openaiPlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('openai', new OpenAI(openaiConfig));
});

export default openaiPlugin;
