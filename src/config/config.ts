import { createConfig } from './create-config';
import { Config, ConfigKeys } from './types';
import { CONFIG_KEYS } from '.';

const assertEnvVarPresence = (key: ConfigKeys): void => {
  if (!Object.keys(process.env).includes(key)) {
    throw new Error(`Environment variable ${key} is missing`);
  }
};

// Check for mandatory environment variables
assertEnvVarPresence(CONFIG_KEYS.APP_URL);
assertEnvVarPresence(CONFIG_KEYS.MONGO_URL);
assertEnvVarPresence(CONFIG_KEYS.ACCESS_TOKEN_SECRET);
assertEnvVarPresence(CONFIG_KEYS.REFRESH_TOKEN_SECRET);
assertEnvVarPresence(CONFIG_KEYS.RESET_TOKEN_SECRET);
assertEnvVarPresence(CONFIG_KEYS.ADMIN_ACCESS_TOKEN_SECRET);
assertEnvVarPresence(CONFIG_KEYS.ADMIN_REFRESH_TOKEN_SECRET);
assertEnvVarPresence(CONFIG_KEYS.GMAIL_EMAIL);
assertEnvVarPresence(CONFIG_KEYS.GMAIL_APP_PASSWORD);

const defaultConfig = Object.freeze<Config>({
  // App
  PORT: Number(process.env.PORT),
  APP_URL: process.env.APP_URL,

  // Token secrets
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET,
  ADMIN_ACCESS_TOKEN_SECRET: process.env.ADMIN_ACCESS_TOKEN_SECRET,
  ADMIN_REFRESH_TOKEN_SECRET: process.env.ADMIN_REFRESH_TOKEN_SECRET,

  // Token expiration
  ACCESS_TOKEN_EXPIRATION_DURATION:
    process.env.ACCESS_TOKEN_EXPIRATION_DURATION || '5m',
  REFRESH_EXPIRATION_DURATION:
    process.env.REFRESH_EXPIRATION_DURATION || '180d',
  RESET_TOKEN_EXPIRATION_DURATION:
    process.env.RESET_TOKEN_EXPIRATION_DURATION || '7d',
  ADMIN_ACCESS_TOKEN_EXPIRATION_DURATION:
    process.env.ACCESS_TOKEN_EXPIRATION_DURATION || '5m',
  ADMIN_REFRESH_EXPIRATION_DURATION:
    process.env.REFRESH_EXPIRATION_DURATION || '180d',

  // MongoDB
  MONGO_URL: process.env.MONGO_URL,

  // SMap API
  SMAP_API_URL: 'https://pro.mapy.cz',

  // Service length chunk size
  SERVICE_LENGTH_CHUNK_SIZE_IN_MINUTES: 15,

  // mailer
  GMAIL_EMAIL: process.env.GMAIL_EMAIL,
  GMAIL_APP_PASSWORD: process.env.GMAIL_PASSWORD,
});

export const config = createConfig(
  {
    development: {},
    test: {},
    production: {},
  },
  defaultConfig,
);
