/** @format */

import { FastifyInstance } from 'fastify';

import imageMethod from './moderation/image';
import textMethod from './moderation/text';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(imageMethod);
  fastify.register(textMethod);
}
