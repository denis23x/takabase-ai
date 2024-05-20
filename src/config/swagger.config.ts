/** @format */

import { SwaggerOptions } from '@fastify/swagger';

export const swaggerConfig: SwaggerOptions = {
  openapi: {
    info: {
      title: 'APIs using Fastify',
      description: '## Moderation using Swagger, Fastify and AI',
      contact: {
        name: 'denis23x',
        url: 'https://takabase.com',
        email: 'damage.23x@gmail.com'
      },
      version: '1.0.0'
    },
    tags: [
      {
        name: 'Moderation',
        description: 'Moderation related end-points'
      }
    ]
  }
};
