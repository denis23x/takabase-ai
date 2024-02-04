/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import * as tfjs from '@tensorflow/tfjs-node';
import * as nsfw from 'nsfwjs';
import { ModerationImageDto } from '../../types/dto/moderation/moderation-image';
import { NSFWJS } from 'nsfwjs';
import { Multipart } from '@fastify/multipart';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'POST',
    url: 'image',
    schema: {
      tags: ['Moderation'],
      description: 'Moderates an image',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            default: 'gantman-mobilenet-v2-quantized'
          },
          input: {
            type: 'string',
            contentMediaType: 'image/png',
            contentEncoding: 'binary'
          }
        },
        required: ['model', 'input'],
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              $ref: 'moderationImageSchema#'
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
    // prettier-ignore
    preValidation: (request: FastifyRequest<ModerationImageDto>, reply: FastifyReply, done: HookHandlerDoneFunction) => {
      request.body = {
        model: 'model',
        input: 'input'
      };

      done();
    },
    handler: async function (request: FastifyRequest<ModerationImageDto>, reply: FastifyReply): Promise<any> {
      const parts: AsyncIterableIterator<Multipart> = request.parts();

      let model: string = 'gantman-mobilenet-v2-quantized';
      let buffer: Buffer = Buffer.from('');

      for await (const part of parts) {
        if (part.type === 'field') {
          const models: string[] = [
            'gantman-inception-v3',
            'gantman-inception-v3-quantized',
            'gantman-mobilenet-v2',
            'gantman-mobilenet-v2-quantized',
            'nsfw-model',
            'nsfw-quantized',
            'nsfw-quantized-mobilenet'
          ];

          if (models.includes(part.value as string)) {
            model = part.value as string;
          } else {
            return reply.status(400).send({
              error: 'Bad Request',
              message: 'Invalid model name',
              statusCode: 400
            });
          }
        }

        if (part.type === 'file') {
          const mimeTypes: string[] = ['image/jpeg', 'image/png'];

          if (mimeTypes.includes(part.mimetype)) {
            buffer = await part.toBuffer();
          } else {
            return reply.status(400).send({
              error: 'Bad Request',
              message: 'Invalid image type. Only PNG and JPG formats are supported',
              statusCode: 400
            });
          }
        }
      }

      const nsfwModel: NSFWJS = await request.server.nsfw.getModel(model);
      const tensorArray: Uint8Array = new Uint8Array(buffer);
      const tensor: tfjs.Tensor3D | tfjs.Tensor4D = tfjs.node.decodeImage(tensorArray, 3);

      await nsfwModel
        .classify(tensor as tfjs.Tensor3D)
        .then((nsfwPredictions: nsfw.predictionType[]) => {
          return reply.status(200).send({
            data: nsfwPredictions,
            statusCode: 200
          });
        })
        .catch((error: any) => {
          return reply.status(500).send({
            error: 'Internal Server Error',
            message: error.message,
            statusCode: 500
          });
        });
    }
  });
}
