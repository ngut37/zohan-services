import { enumerate } from '@utils/enumerate';

import { ConfigKeys } from './types';

export const CONFIG_KEYS = enumerate<ConfigKeys>([
  'PORT',
  'MONGO_URL',
  'APP_ENV',
  'TESTING_EMAIL',

  'ACCESS_TOKEN_SECRET',
  'ACCESS_TOKEN_EXPIRATION_DURATION',

  'REFRESH_TOKEN_SECRET',
  'REFRESH_EXPIRATION_DURATION',

  'SMAP_API_URL',
  'SERVICE_LENGTH_CHUNK_SIZE_IN_MINUTES',
]);
