/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as nsfw from 'nsfwjs';
import process from 'process';
import path from 'path';

const nsfwPlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('nsfw', {
    getModel: (modelName: string): Promise<nsfw.NSFWJS> => {
      const modelPath: string = 'file://' + path.join(process.cwd(), 'src/nsfw', modelName, 'model.json');
      const modelOptions: any = {
        'gantman-inception-v3': {
          size: 299
        },
        'gantman-inception-v3-quantized': {
          size: 299
        },
        'gantman-mobilenet-v2': {
          type: 'graph',
          size: 224
        },
        'gantman-mobilenet-v2-quantized': {
          type: 'graph',
          size: 224
        },
        'nsfw-model': {
          size: 299
        },
        'nsfw-quantized': {
          type: 'graph',
          size: 224
        },
        'nsfw-quantized-mobilenet': {
          size: 224
        }
      };

      return nsfw.load(modelPath, modelOptions[modelName]);
    },
    getUint8Array: (base64: string): Uint8Array => {
      const raw: string = atob(base64);
      const rawLength: number = raw.length;

      const uint8Array: Uint8Array = new Uint8Array(new ArrayBuffer(rawLength));

      for (let i: number = 0; i < rawLength; i += 1) {
        uint8Array[i] = raw.charCodeAt(i);
      }

      return uint8Array;
    }
  });
});

export default nsfwPlugin;
