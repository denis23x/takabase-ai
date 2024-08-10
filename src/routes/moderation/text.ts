/** @format */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ModerationTextDto } from '../../types/dto/moderation/moderation-text';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'POST',
    url: 'text',
    schema: {
      tags: ['Moderation'],
      description: 'Moderates a text',
      body: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            example: 'text-moderation-stable'
          },
          input: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['Some dirty dirty text here']
          }
        },
        required: ['model', 'input']
      },
      response: {
        '200': {
          type: 'object',
          properties: {
            data: {
              type: 'object',
              properties: {
                id: {
                  type: 'string'
                },
                model: {
                  type: 'string'
                },
                results: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      flagged: {
                        type: 'boolean'
                      },
                      categories: {
                        type: 'object',
                        properties: {
                          sexual: {
                            type: 'boolean'
                          },
                          hate: {
                            type: 'boolean'
                          },
                          harassment: {
                            type: 'boolean'
                          },
                          'self-harm': {
                            type: 'boolean'
                          },
                          'sexual/minors': {
                            type: 'boolean'
                          },
                          'hate/threatening': {
                            type: 'boolean'
                          },
                          'violence/graphic': {
                            type: 'boolean'
                          },
                          'self-harm/intent': {
                            type: 'boolean'
                          },
                          'self-harm/instructions': {
                            type: 'boolean'
                          },
                          'harassment/threatening': {
                            type: 'boolean'
                          },
                          violence: {
                            type: 'boolean'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            statusCode: {
              type: 'number'
            }
          }
        },
        '4xx': {
          $ref: 'responseErrorSchema#'
        },
        '5xx': {
          $ref: 'responseErrorSchema#'
        }
      }
    },
    handler: async (request: FastifyRequest<ModerationTextDto>, reply: FastifyReply): Promise<any> => {
      const moderationCreateParams: any = {
        ...request.body
      };

      await reply.server.openai.moderations
        .create(moderationCreateParams)
        .then((moderationCreateResponse: any) => {
          return reply.status(200).send({
            data: moderationCreateResponse,
            statusCode: 200
          });
        })
        .catch(() => {
          return reply.status(500).send({
            error: 'Internal Server Error',
            message: 'Unable to moderate input text',
            statusCode: 500
          });
        });
    }
  });
}
