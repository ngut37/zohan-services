import nconf from 'nconf';

import { Environments, Config, EnvironmentName } from './types';

export const createConfig = (envs: Environments, defaultConfig: Config) => {
  // ENVIRONMENT ENV VARIABLE
  const APP_ENV = (process.env.APP_ENV as EnvironmentName) || 'development';

  // MERGE DEFAULT CONFIG
  let defaults: Config = {
    APP_ENV,
    ...defaultConfig,
  };

  // INCLUDE APP ENV RELATED CONFIG
  if (envs[APP_ENV]) {
    defaults = { ...defaults, ...envs[APP_ENV] };
  }

  // FACTORY NCONF
  nconf.env({ parseValues: true }).defaults(defaults);

  return nconf;
};
