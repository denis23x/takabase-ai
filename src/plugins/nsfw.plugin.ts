/** @format */

import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync, FastifyReply } from 'fastify';
import * as nsfw from 'nsfwjs';
import path from 'path';

const nsfwModelOptions: Record<string, any> = {
  'gantman-mobilenet-v2': {
    type: 'graph',
    size: 224
  },
  'gantman-mobilenet-v2-quantized': {
    type: 'graph',
    size: 224
  }
};

const nsfwPlugin: FastifyPluginAsync = fp(async function (fastifyInstance: FastifyInstance) {
  fastifyInstance.decorate('nsfw', {
    // prettier-ignore
    getModel: (modelName: string): Promise<nsfw.NSFWJS> => {
      return nsfw.load('file://' + path.join(__dirname, '../nsfw', modelName, 'model.json'), nsfwModelOptions[modelName]);
    },
    getValidationModel: (reply: FastifyReply, modelName: string): FastifyReply | null => {
      if (!Object.keys(nsfwModelOptions).includes(modelName)) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'Model not found',
          statusCode: 404
        });
      }

      return null;
    },
    getValidationFileSize: (reply: FastifyReply, size: number): FastifyReply | null => {
      const sizeMax: number = 1048576 * 5;

      if (size >= sizeMax) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Maximum file size exceeded',
          statusCode: 400
        });
      }

      return null;
    },
    getValidationMimeType: (reply: FastifyReply, mimeType: string): FastifyReply | null => {
      const mimeTypeList: string[] = ['image/jpg', 'image/jpeg', 'image/png'];

      if (!mimeTypeList.includes(mimeType)) {
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Invalid MIME type',
          statusCode: 400
        });
      }

      return null;
    }
  });
});

export default nsfwPlugin;
