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
  'hair-cut',
  'hair-color',
  'nail-extension',
  'nail-acrylic',
  'nail-gel',
  'tattoo-small-black',
  'tattoo-medium-black',
  'tattoo-small-color',
  'tattoo-medium-color',
  'massage-thai',
  'massage-turkish',
  'spa-facial',
  'spa-body',
]);

export type ServiceName = keyof typeof SERVICE_NAMES;
