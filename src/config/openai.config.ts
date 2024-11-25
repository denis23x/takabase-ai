/** @format */

import { config } from 'dotenv';
import type { ClientOptions } from 'openai';

config({
  path: '.env.takabase-local',
  override: false
});

// https://github.com/openai/openai-node

const openaiConfigList: Record<string, ClientOptions> = {
  localhost: {
    apiKey: String(process.env.AI_OPENAI_API_KEY)
  },
  development: {
    apiKey: String(process.env.AI_OPENAI_API_KEY)
  },
  production: {
    apiKey: String(process.env.AI_OPENAI_API_KEY)
  }
};

export const openaiConfig: ClientOptions = openaiConfigList[String(process.env.APP_NODE_ENV)];
