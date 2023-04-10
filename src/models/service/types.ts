import { enumerate } from '@utils/enumerate';

export const SERVICE_TYPES = enumerate([
  'hair',
  'nail',
  'tattoo',
  'massage',
  'spa',
]);

export type ServiceType = keyof typeof SERVICE_TYPES;

export const SERVICE_NAMES = enumerate([
  'hair_cut',
  'hair_color',
  'nail_acrylic',
  'nail_gel',
  'tattoo_small_black',
  'tattoo_medium_black',
  'tattoo_small_color',
  'tattoo_medium_color',
  'massage_thai',
  'massage_turkish',
  'spa_wellness_jacuzzi',
  'spa_sauna',
]);

export type ServiceName = keyof typeof SERVICE_NAMES;
