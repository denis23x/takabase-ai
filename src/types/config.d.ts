/** @format */

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      NODE_ENV: 'development' | 'production';
      APP_PORT: number;
      APP_HOST: string;
      ENABLE_SWAGGER: boolean;
      OPENAI_API_KEY: string;
    };
  }
}

export {};
