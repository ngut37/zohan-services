import { SignOptions } from 'jsonwebtoken';

type FullConfig = {
  APP_ENV: EnvironmentName;
  PORT: number;
  APP_URL: string;

  MONGO_URL: string;
  TESTING_EMAIL: string;

  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  RESET_TOKEN_SECRET: string;
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  ACCESS_TOKEN_EXPIRATION_DURATION: SignOptions['expiresIn'];
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  REFRESH_EXPIRATION_DURATION: SignOptions['expiresIn'];
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  RESET_TOKEN_EXPIRATION_DURATION: SignOptions['expiresIn'];

  ADMIN_ACCESS_TOKEN_SECRET: string;
  ADMIN_REFRESH_TOKEN_SECRET: string;
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  ADMIN_ACCESS_TOKEN_EXPIRATION_DURATION: SignOptions['expiresIn'];
  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  ADMIN_REFRESH_EXPIRATION_DURATION: SignOptions['expiresIn'];

  /** URL of mapy.cz API used for address suggestions */
  SMAP_API_URL: string;

  /** Size of service length chunks in minutes */
  SERVICE_LENGTH_CHUNK_SIZE_IN_MINUTES: number;

  /** Mailer email credentials */
  GMAIL_EMAIL: string;
  GMAIL_APP_PASSWORD: string;
};

export type Config = Partial<FullConfig>;

export type ConfigKeys = keyof FullConfig;

export type EnvironmentName = 'development' | 'test' | 'production';

export type Environments = { [key in EnvironmentName]: Config } & {
  [key: string]: Record<string, any>;
};
