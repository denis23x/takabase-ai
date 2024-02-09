/** @format */

import * as nsfw from 'nsfwjs';

declare module 'fastify' {
  interface FastifyInstance {
    nsfw: {
      getModel: (modelName: string) => Promise<nsfw.NSFWJS>;
      getModelValidation: (reply: FastifyReply, modelName: string) => FastifyReply | null;
      getFileSizeValidation: (reply: FastifyReply, size: number) => FastifyReply | null;
      getMimeTypeValidation: (reply: FastifyReply, mimeType: string) => FastifyReply | null;
    };
  }
}

export {};
