export type Config = Partial<{
  PORT: number;
  MONGO_URL: string;
  APP_ENV: EnvironmentName;
  TESTING_EMAIL: string;
}>;

export type ConfigKeys = keyof Config;

export type EnvironmentName = 'development' | 'test' | 'production';

export type Environments = { [key in EnvironmentName]: Config } & {
  [key: string]: Record<string, any>;
};
