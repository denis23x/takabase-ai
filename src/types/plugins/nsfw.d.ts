/** @format */

import * as nsfw from 'nsfwjs';

declare module 'fastify' {
  interface FastifyInstance {
    nsfw: {
      getModel: (modelName: string) => Promise<nsfw.NSFWJS>;
      getValidationModel: (reply: FastifyReply, modelName: string) => FastifyReply | null;
      getValidationFileSize: (reply: FastifyReply, size: number) => FastifyReply | null;
      getValidationMimeType: (reply: FastifyReply, mimeType: string) => FastifyReply | null;
    };
  }
}

export {};
