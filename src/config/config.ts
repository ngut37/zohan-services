import { createConfig } from './create-config';
import { Config, ConfigKeys } from './types';
import { CONFIG_KEYS } from '.';

const checkEnvVarPresence = (key: ConfigKeys): boolean => {
  const keyPresent = !process.env[key];
  if (keyPresent) console.error(`${key} is absent in process.env file`);
  return keyPresent;
};

// Check for mandatory environment variables
checkEnvVarPresence(CONFIG_KEYS.MONGO_URL);
checkEnvVarPresence(CONFIG_KEYS.ACCESS_TOKEN_SECRET);
checkEnvVarPresence(CONFIG_KEYS.REFRESH_TOKEN_SECRET);

const defaultConfig = Object.freeze<Config>({
  // App
  PORT: Number(process.env.PORT),

  // Token secrets
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

  // Token expiration
  ACCESS_TOKEN_EXPIRATION_DURATION:
    process.env.ACCESS_TOKEN_EXPIRATION_DURATION || '1h',
  REFRESH_EXPIRATION_DURATION:
    process.env.REFRESH_EXPIRATION_DURATION || '180d',

  // MongoDB
  MONGO_URL: process.env.MONGO_URL,

  // SMap API
  SMAP_API_URL: 'https://pro.mapy.cz',
});

export const config = createConfig(
  {
    development: {},
    test: {},
    production: {},
  },
  defaultConfig,
);
