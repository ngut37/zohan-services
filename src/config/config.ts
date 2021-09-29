import { createConfig } from './create-config';
import { Config } from './types';

// Check for mandatory .env variables
if (!process.env.ACCESS_TOKEN_SECRET)
  console.error('ACCESS_TOKEN_SECRET absent in .env file.');
if (!process.env.REFRESH_TOKEN_SECRET)
  console.error('REFRESH_TOKEN_SECRET absent in .env file.');

const defaultConfig: Config = {
  PORT: 4000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION_DURATION:
    process.env.ACCESS_TOKEN_EXPIRATION_DURATION,
  REFRESH_EXPIRATION_DURATION: process.env.REFRESH_EXPIRATION_DURATION,
  MONGO_URL: 'mongodb://localhost/zohan',
};

export const config = createConfig(
  {
    development: {},
    test: {},
    production: {
      MONGO_URL:
        'mongodb+srv://zohan_app_engine:5ltjuNvuVU4HFRRI@zohan.7jeef.mongodb.net/zohan?retryWrites=true&w=majority',
    },
  },
  defaultConfig,
);
