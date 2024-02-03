/** @format */

import { FastifyInstance } from 'fastify';

import imageMethod from './image';
import textMethod from './text';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.register(imageMethod);
  fastify.register(textMethod);
}
