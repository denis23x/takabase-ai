/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ModerationTextDto } from '../../types/dto/moderation/moderation-text';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'POST',
    url: 'text',
    schema: {
      tags: ['Moderation'],
      description: 'Moderates a text',
      body: {
        anyOf: [
          {
            type: 'object',
            properties: {
              model: {
                type: 'string'
              },
              input: {
                type: 'string'
              }
            },
            required: ['input'],
            additionalProperties: false
          },
          {
            type: 'object',
            properties: {
              model: {
                type: 'string'
              },
              input: {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            },
            required: ['input'],
            additionalProperties: false
          }
        ]
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              $ref: 'moderationSchema#'
            },
            statusCode: {
              type: 'number'
            }
          }
        },
        400: {
          $ref: 'responseErrorSchema#'
        },
        500: {
          $ref: 'responseErrorSchema#'
        }
      }
    },
    handler: async function (request: FastifyRequest<ModerationTextDto>, reply: FastifyReply): Promise<any> {
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
            message: 'Unable to moderate input text at this time',
            statusCode: 500
          });
        });
    }
  });
}
