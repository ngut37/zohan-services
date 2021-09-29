import { SignOptions } from 'jsonwebtoken';

export type Config = Partial<{
  PORT: number;
  MONGO_URL: string;
  APP_ENV: EnvironmentName;
  TESTING_EMAIL: string;

  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;

  /** expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d" */
  ACCESS_TOKEN_EXPIRATION_DURATION: SignOptions['expiresIn'];
  REFRESH_EXPIRATION_DURATION: SignOptions['expiresIn'];
}>;

export type ConfigKeys = keyof Config;

export type EnvironmentName = 'development' | 'test' | 'production';

export type Environments = { [key in EnvironmentName]: Config } & {
  [key: string]: Record<string, any>;
};
