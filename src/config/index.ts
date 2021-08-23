// import { createConfig } from './create-config';
import { createConfig } from './create-config';

export const config = createConfig(
  { development: {}, test: {}, production: {} },
  { PORT: 3000 },
);

export * from './types';
