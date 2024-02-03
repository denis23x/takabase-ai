/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import * as tfjs from '@tensorflow/tfjs-node';
import * as nsfw from 'nsfwjs';
import * as fs from 'fs';
import path from 'path';
import process from 'process';
import { ModerationImageDto } from '../../types/dto/moderation/moderation-image';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'POST',
    url: 'image',
    schema: {
      tags: ['Moderation'],
      description: 'Moderates an image',
      body: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            // default: 'gantman-inception-v3'
            // default: 'gantman-inception-v3-quantized'
            default: 'gantman-mobilenet-v2'
            // default: 'gantman-mobilenet-v2-quantized'
            // default: 'nsfw-model'
            // default: 'nsfw-quantized'
            // default: 'nsfw-quantized-mobilenet'
          }
        },
        required: ['model'],
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  className: {
                    type: 'string'
                  },
                  probability: {
                    type: 'number'
                  }
                }
              }
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
    handler: async function (request: FastifyRequest<ModerationImageDto>, reply: FastifyReply): Promise<any> {
      const { model } = request.body;

      fs.readFile(path.join(process.cwd(), 'src/nsfw/images', 'test-12.png'), 'base64', async (err, data) => {
        if (err) {
          console.log(err);
        } else {
          request.server.nsfw
            .getModel(model)
            .then((nsfwModel: nsfw.NSFWJS) => {
              const tensorArray: Uint8Array = request.server.nsfw.getUint8Array(data);
              const tensor: tfjs.Tensor3D | tfjs.Tensor4D = tfjs.node.decodeImage(tensorArray, 3);

              nsfwModel
                .classify(tensor as tfjs.Tensor3D)
                .then((nsfwPredictions: nsfw.predictionType[]) => {
                  console.log(nsfwPredictions);

                  tensor.dispose();
                })
                .catch(() => {});
            })
            .catch((aaa: any) => {
              console.log(aaa);
            });
        }
      });

      return reply.status(500).send({
        error: 'Internal Server Error',
        message: 'Unable to moderate input image at this time',
        statusCode: 500
      });
    }
  });
}
