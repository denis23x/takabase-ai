/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import * as nsfw from 'nsfwjs';
import path from 'path';

const nsfwPlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('nsfw', {
    getModel: (modelName: string): Promise<nsfw.NSFWJS> => {
      const modelPath: string = 'file://' + path.join(__dirname, '../nsfw', modelName, 'model.json');
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
    }
  });
});

export default nsfwPlugin;
