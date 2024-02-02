/** @format */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import * as tfjs from '@tensorflow/tfjs-node';
import * as nsfw from 'nsfwjs';
import * as fs from 'fs';
import path from 'path';
import process from 'process';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: 'POST',
    url: 'image',
    schema: {
      tags: ['Moderation'],
      description: 'Moderates an image',
      // body: {
      //   anyOf: [
      //     {
      //       type: 'object',
      //       properties: {
      //         input: {
      //           type: 'string'
      //         }
      //       },
      //       required: ['input'],
      //       additionalProperties: false
      //     },
      //     {
      //       type: 'object',
      //       properties: {
      //         input: {
      //           type: 'array',
      //           items: {
      //             type: 'string'
      //           }
      //         }
      //       },
      //       required: ['input'],
      //       additionalProperties: false
      //     }
      //   ]
      // },
      response: {
        200: {
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
    handler: async function (request: FastifyRequest<any>, reply: FastifyReply): Promise<any> {
      fs.readFile(path.join(process.cwd(), 'src/nsfw/images', 'test-12.png'), 'base64', async (err, data) => {
        if (err) {
          return;
        }

        const base64ToUint8Array = (base64: string): Uint8Array => {
          const raw: string = atob(base64);
          const rawLength: number = raw.length;

          const uint8Array: Uint8Array = new Uint8Array(new ArrayBuffer(rawLength));

          for (let i: number = 0; i < rawLength; i += 1) {
            uint8Array[i] = raw.charCodeAt(i);
          }

          return uint8Array;
        };

        // test-6.png
        // 244 - porn 0.3
        // 299 - porn 0.7
        // graph - porn 0.05

        const model: nsfw.NSFWJS = await nsfw.load(
          'file://' + path.join(process.cwd(), 'src/nsfw', 'graph', 'model.json'),
          {
            // @ts-ignore
            type: 'graph'
          }
        );

        // if (fastifyInstance.config.NODE_ENV) {
        //   tfjs.enableProdMode();
        // }

        const image: tfjs.Tensor3D | tfjs.Tensor4D = tfjs.node.decodeImage(base64ToUint8Array(data), 3);

        // @ts-ignore
        const predictions: nsfw.predictionType = await model.classify(image);

        image.dispose();

        console.log(predictions);
      });

      return reply.status(500).send({
        error: 'Undefined',
        message: 'Undefined',
        statusCode: 500
      });

      // const imageBuffer: Buffer = await fs.readFileSync(path.join(process.cwd(), 'upload/model/test.jpeg'));
      //
      // const nsfwSpy: NsfwSpy = new NsfwSpy(path.join(process.cwd(), 'upload/model/model.json'));
      // await nsfwSpy.load();
      //
      // return await nsfwSpy
      //   .classifyImageFromByteArray(imageBuffer)
      //   .then((nsfwSpyResult: NsfwSpyResult) => {
      //     console.log('nsfwSpyResult', nsfwSpyResult);
      //
      //     return reply.status(200).send({
      //       data: nsfwSpyResult,
      //       statusCode: 200
      //     });
      //   })
      //   .catch((error: any) => {
      //     console.log('error', error);
      //
      //     return reply.status(500).send({
      //       error: 'Undefined',
      //       message: 'Undefined',
      //       statusCode: 500
      //     });
      //   });
    }
  });
}
