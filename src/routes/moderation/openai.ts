/** @format */

import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ModerationOpenAIDto } from '../../types/dto/moderation/moderation-openai';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'POST',
    url: 'openai',
    schema: {
      tags: ['Moderation'],
      description: 'Moderates an image and text',
      body: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            example: 'omni-moderation-latest'
          },
          input: {
            type: 'array',
            items: {
              anyOf: [
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      example: 'image_url'
                    },
                    image_url: {
                      type: 'object',
                      properties: {
                        url: {
                          type: 'string',
                          example: 'https://placehold.co/600x400.png'
                        }
                      }
                    }
                  }
                },
                {
                  type: 'object',
                  properties: {
                    type: {
                      type: 'string',
                      example: 'text'
                    },
                    text: {
                      type: 'string',
                      example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
                    }
                  }
                }
              ]
            }
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
    handler: async (request: FastifyRequest<ModerationOpenAIDto>, reply: FastifyReply): Promise<any> => {
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
            message: 'Unable to moderate',
            statusCode: 500
          });
        });
    }
  });
}
