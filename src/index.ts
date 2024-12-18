/** @format */

import { main } from './main';
import { onRequest } from 'firebase-functions/v2/https';
import type { FastifyInstance } from 'fastify';
import type { FastifyListenOptions } from 'fastify/types/instance';
import type { HttpsFunction, HttpsOptions, Request } from 'firebase-functions/v2/https';
import type { Response } from 'express';

/** FASTIFY */

const exitHandler = (app: FastifyInstance, exitCode: number): void => {
  app.close(() => {
    app.log.info('Server closed');

    process.exit(exitCode);
  });
};

main()
  .then((fastifyInstance: FastifyInstance) => {
    // GRACEFUL SHUTDOWN

    ['SIGINT', 'SIGTERM'].forEach((signal: string): void => {
      process.on(signal, () => {
        fastifyInstance.log.info('Attempting to gracefully shutdown the app');

        exitHandler(fastifyInstance, 0);
      });
    });

    // UNEXPECTED SHUTDOWN

    ['uncaughtException', 'unhandledRejection'].forEach((signal: string): void => {
      process.on(signal, (error: any) => {
        fastifyInstance.log.error(error);

        exitHandler(fastifyInstance, 1);
      });
    });

    // DEFAULT
    const options: FastifyListenOptions = {
      port: 4500,
      host: 'localhost',
      listenTextResolver: () => ''
    };

    // PROCESS

    fastifyInstance.listen(options).catch((error: any) => fastifyInstance.log.error(error));
  })
  .catch((error: any) => {
    console.error(error);

    // BOOTSTRAP FAILED

    process.exit(1);
  });

/** FIREBASE */

// prettier-ignore
export const apiHttpsOptions: HttpsOptions = {
  region: 'us-central1',
  minInstances: 0,
  maxInstances: 4,
  memory: '512MiB',
  secrets: [
    'APP_NODE_ENV',
    'AI_OPENAI_API_KEY'
  ]
};

export const ai: HttpsFunction = onRequest(apiHttpsOptions, async (request: Request, response: Response) => {
  const fastifyInstance: FastifyInstance = await main();

  await fastifyInstance.ready();

  fastifyInstance.server.emit('request', request, response);
});
