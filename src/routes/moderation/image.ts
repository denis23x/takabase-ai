/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import * as tfjs from '@tensorflow/tfjs-node';
import * as nsfw from 'nsfwjs';
import { ModerationImageDto } from '../../types/dto/moderation/moderation-image';
import { NSFWJS } from 'nsfwjs';
import * as os from 'os';
import path from 'path';
import * as fs from 'fs';
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
    preValidation: (request: FastifyRequest<ModerationImageDto>, reply: FastifyReply, done: HookHandlerDoneFunction) => {

      /** Swagger validation hack */

      request.body = {
        model: 'model',
        input: 'input'
      };

      done();
    },
    handler: async function (request: FastifyRequest<ModerationImageDto>, reply: FastifyReply): Promise<any> {
      const busboy: Busboy.Busboy = Busboy({ headers: request.headers });
      const tmpdir: string = os.tmpdir();

      const formFields: Record<string, any> = {};
      const formFileUploads: Record<string, string> = {};

      /** Grab form fields */

      busboy.on('field', (fieldName: string, value: string): void => {
        formFields[fieldName] = value;
      });

      /** Grab form files */

      let fileData: any = null;
      const fileWrites: any[] = [];

      // @ts-ignore
      busboy.on('file', (fieldName: string, file: any, { filename }): void => {
        const filePath: string = path.join(tmpdir, filename);

        formFileUploads[fieldName] = filePath;

        const writeStream: fs.WriteStream = fs.createWriteStream(filePath);

        file.pipe(writeStream);

        const promise: Promise<void> = new Promise((resolve, reject) => {
          file.on('data', (data: any) => {
            fileData = fileData === null ? data : Buffer.concat([fileData, data]);
          });

          file.on('end', () => {
            writeStream.end();
          });

          writeStream.on('close', resolve);
          writeStream.on('error', reject);
        });

        fileWrites.push(promise);
      });

      /** Free memory */

      busboy.on('finish', async () => {
        await Promise.all(fileWrites);

        for (const file in formFileUploads) {
          fs.unlinkSync(formFileUploads[file]);
        }
      });

      // @ts-ignore
      busboy.end(request.raw.body);

      /** NSFW */

      const nsfwModel: NSFWJS = await request.server.nsfw.getModel(formFields.model);
      const tensorArray: Uint8Array = new Uint8Array(fileData);
      const tensor: tfjs.Tensor3D | tfjs.Tensor4D = tfjs.node.decodeImage(tensorArray, 3);

      // tfjs.enableProdMode();

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
