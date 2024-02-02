/** @format */

import { ClientOptions } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

// https://github.com/openai/openai-node

const openaiConfigList: Record<string, ClientOptions> = {
  development: {
    apiKey: String(process.env.OPENAI_API_KEY)
  },
  production: {
    apiKey: String(process.env.OPENAI_API_KEY)
  }
};

export const openaiConfig: ClientOptions = openaiConfigList[String(process.env.NODE_ENV)];
