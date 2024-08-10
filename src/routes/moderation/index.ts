/** @format */

import imageMethod from './image';
import textMethod from './text';
import type { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(imageMethod);
  fastify.register(textMethod);
}
