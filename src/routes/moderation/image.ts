/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import * as tfjs from '@tensorflow/tfjs-node';
import * as nsfw from 'nsfwjs';
import { ModerationImageDto } from '../../types/dto/moderation/moderation-image';
import Busboy from 'busboy';

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
          fileMimeType: fileInfo.mimeType,
          file: null,
          fileSize: 0
        };

        // prettier-ignore
        file.on('data', (chunk: any[]): void => {
          formFiles[fieldName].file = formFiles[fieldName].file === null ? chunk : Buffer.concat([formFiles[fieldName].file, chunk]);
          formFiles[fieldName].fileSize = formFiles[fieldName].fileSize + chunk.length;
        });
      });

      /** NSFW */

      await new Promise((): void => {
        busboy.on('finish', async (): Promise<void> => {
          const modelList: string[] = [
            'gantman-inception-v3',
            'gantman-inception-v3-quantized',
            'gantman-mobilenet-v2',
            'gantman-mobilenet-v2-quantized',
            'nsfw-model',
            'nsfw-quantized',
            'nsfw-quantized-mobilenet'
          ];

          if (!modelList.includes(formFields.model)) {
            return reply.status(404).send({
              error: 'Not Found',
              message: 'AI model not found',
              statusCode: 404
            });
          }

          const mimeTypeList: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

          if (!mimeTypeList.includes(formFiles.input.fileMimeType)) {
            return reply.status(400).send({
              error: 'Bad Request',
              message: 'Invalid MIME type',
              statusCode: 400
            });
          }

          const fileSize: number = 1048576 * 5;

          if (formFiles.input.fileSize >= fileSize) {
            return reply.status(400).send({
              error: 'Bad Request',
              message: 'Maximum file size exceeded',
              statusCode: 400
            });
          }

          /** TensorFlow */

          if (fastify.config.NODE_ENV === 'production') {
            tfjs.enableProdMode();
          }

          const nsfwModel: nsfw.NSFWJS = await request.server.nsfw.getModel(formFields.model);
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
