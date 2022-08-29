import { createConfig } from './create-config';
import { Config, ConfigKeys } from './types';
import { CONFIG_KEYS } from '.';

const checkEnvVarPresence = (key: ConfigKeys): boolean => {
  const keyPresent = !process.env[key];
  if (keyPresent) console.error(`${key} absent in .env file.`);
  return keyPresent;
};

// Check for mandatory .env variables
checkEnvVarPresence(CONFIG_KEYS.MONGO_URL);
checkEnvVarPresence(CONFIG_KEYS.ACCESS_TOKEN_SECRET);
checkEnvVarPresence(CONFIG_KEYS.REFRESH_TOKEN_SECRET);

const defaultConfig: Config = {
  PORT: Number(process.env.PORT),
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '1h',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '180d',
  ACCESS_TOKEN_EXPIRATION_DURATION:
    process.env.ACCESS_TOKEN_EXPIRATION_DURATION,
  REFRESH_EXPIRATION_DURATION: process.env.REFRESH_EXPIRATION_DURATION,
  MONGO_URL: process.env.MONGO_URL,
};

export const config = createConfig(
  {
    development: {},
    test: {},
    production: {},
  },
  defaultConfig,
);
