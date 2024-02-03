/** @format */

import * as nsfw from 'nsfwjs';

declare module 'fastify' {
  interface FastifyInstance {
    nsfw: {
      getModel: (modelName: string) => Promise<nsfw.NSFWJS>;
      getUint8Array: (base64: string) => Uint8Array;
    };
  }
}

export {};
