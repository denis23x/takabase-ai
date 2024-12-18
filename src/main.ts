/** @format */

import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCompress from '@fastify/compress';
import fastifyHelmet from '@fastify/helmet';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import fastifyEtag from '@fastify/etag';
import type { FastifyRequest, FastifyInstance, FastifyReply } from 'fastify';
import type { ContentTypeParserDoneFunction } from 'fastify/types/content-type-parser';

// CONFIGURATIONS

import { corsConfig } from './config/cors.config';
import { loggerConfig } from './config/logger.config';
import { compressConfig } from './config/compress.config';
import { helmetConfig } from './config/helmet.config';
import { swaggerConfig } from './config/swagger.config';
import { rateLimitConfig } from './config/rate-limit.config';
import { staticConfig } from './config/static.config';

// PLUGINS

import nsfwPlugin from './plugins/nsfw.plugin';
import openaiPlugin from './plugins/openai.plugin';

// ROUTES

import moderationRoutes from './routes/moderation';

// SCHEMAS

import { responseErrorSchema } from './schema/crud/response/response-error.schema';

export const main = async (): Promise<FastifyInstance> => {
  const fastifyInstance: FastifyInstance = fastify({
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    ajv: {
      customOptions: {
        // removeAdditional: 'all',
        keywords: ['example']
      }
    },
    logger: loggerConfig
  });

  // PLUGINS

  await fastifyInstance.register(fastifyCors, corsConfig);
  await fastifyInstance.register(fastifyCompress, compressConfig);
  await fastifyInstance.register(fastifyHelmet, helmetConfig);
  await fastifyInstance.register(fastifyRateLimit, rateLimitConfig);
  await fastifyInstance.register(fastifyStatic, staticConfig);
  await fastifyInstance.register(fastifyEtag);

  // NOINDEX

  fastifyInstance.addHook('onSend', async (_, reply: FastifyReply, payload) => {
    reply.header('X-Robots-Tag', 'noindex');

    return payload;
  });

  // PLUGINS HANDMADE

  await fastifyInstance.register(nsfwPlugin);
  await fastifyInstance.register(openaiPlugin);

  // JSON SCHEMA CRUD

  fastifyInstance.addSchema(responseErrorSchema);

  // LOCALHOST

  if (process.env.APP_NODE_ENV === 'localhost') {
    await fastifyInstance.register(fastifySwagger, swaggerConfig);
    await fastifyInstance.register(fastifySwaggerUi, {
      routePrefix: '/docs'
    });
  }

  // GCP ISSUE

  fastifyInstance.removeAllContentTypeParsers();

  // prettier-ignore
  fastifyInstance.addContentTypeParser('application/json', (request: FastifyRequest, body: any, done: ContentTypeParserDoneFunction): void => {
    done(null, body.body);
  });

  // prettier-ignore
  fastifyInstance.addContentTypeParser('multipart/form-data', (request: FastifyRequest, payload: any, done: ContentTypeParserDoneFunction): void => {
    done(null);
  });

  // API

  await fastifyInstance.register(
    async (api: FastifyInstance): Promise<void> => {
      api.register(moderationRoutes, {
        prefix: '/moderation/'
      });
    },
    {
      prefix: '/api/v1'
    }
  );

  return fastifyInstance;
};
