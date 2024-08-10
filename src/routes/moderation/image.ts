/** @format */

import Busboy from 'busboy';
import * as tfjs from '@tensorflow/tfjs-node';
import * as nsfw from 'nsfwjs';
import type { NSFWJS } from 'nsfwjs';
import type { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import type { ModerationImageDto } from '../../types/dto/moderation/moderation-image';

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
            example: 'gantman-mobilenet-v2'
          },
          input: {
            type: 'string',
            format: 'binary'
          }
        },
        required: ['model', 'input']
      },
      response: {
        '200': {
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
        '4xx': {
          $ref: 'responseErrorSchema#'
        },
        '5xx': {
          $ref: 'responseErrorSchema#'
        }
      }
    },
    // prettier-ignore
    preValidation: (request: FastifyRequest<ModerationImageDto>, reply: FastifyReply, done: HookHandlerDoneFunction): void => {
      // Swagger pass validation

      request.body = {
        model: 'model',
        input: 'input'
      };

      done();
    },
    handler: async (request: FastifyRequest<ModerationImageDto>, reply: FastifyReply): Promise<any> => {
      const busboy: Busboy.Busboy = Busboy({
        headers: request.headers
      });

      /** Busboy */

      const formFields: Record<string, any> = {};

      busboy.on('field', (fieldName: string, value: string): void => {
        formFields[fieldName] = value;
      });

      const formFiles: Record<string, any> = {};

      busboy.on('file', (fieldName: string, file: any, fileInfo: Busboy.FileInfo): void => {
        formFiles[fieldName] = {
          mimeType: fileInfo.mimeType,
          file: null,
          size: 0
        };

        // prettier-ignore
        file.on('data', (chunk: any[]): void => {
          formFiles[fieldName].file = formFiles[fieldName].file === null ? chunk : Buffer.concat([formFiles[fieldName].file, chunk]);
          formFiles[fieldName].size = formFiles[fieldName].size + chunk.length;
        });
      });

      /** NSFW */

      await new Promise((): void => {
        busboy.on('finish', async (): Promise<void> => {
          const validationPayload = (): any[] => {
            return [
              request.server.nsfw.getValidationModel(reply, formFields.model),
              request.server.nsfw.getValidationFileSize(reply, formFiles.input.size),
              request.server.nsfw.getValidationMimeType(reply, formFiles.input.mimeType)
            ].filter((validation: FastifyReply | null) => validation !== null);
          };

          const validation: FastifyReply[] = validationPayload();

          /** Throw out the first (any) error */

          if (validation.length) {
            return validation[0];
          }

          /** TensorFlow */

          if (process.env.APP_NODE_ENV !== 'localhost') {
            tfjs.enableProdMode();
          }

          const nsfwModel: NSFWJS = await request.server.nsfw.getModel(formFields.model);
          const tensorArray: Uint8Array = new Uint8Array(formFiles.input.file);
          const tensor: tfjs.Tensor3D | tfjs.Tensor4D = tfjs.node.decodeImage(tensorArray, 3);

          // prettier-ignore
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
        });

        // @ts-ignore
        busboy.end(request.raw.body);
      });
    }
  });
}
