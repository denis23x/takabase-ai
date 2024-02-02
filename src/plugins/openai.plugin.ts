/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { openaiConfig } from '../config/openai.config';
import OpenAI from 'openai';

const openaiPlugin: FastifyPluginAsync = fp(async function openaiPlugin(fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('openai', new OpenAI(openaiConfig));
});

export default openaiPlugin;
