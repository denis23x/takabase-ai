/** @format */

import { SwaggerOptions } from '@fastify/swagger';

export const swaggerConfig: SwaggerOptions = {
  swagger: {
    info: {
      title: 'APIs using Fastify',
      description: 'Moderation using Swagger, Fastify and AI',
      version: '0.0.1'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      {
        name: 'Moderation',
        description: 'Moderation related end-points'
      }
    ]
  }
};
