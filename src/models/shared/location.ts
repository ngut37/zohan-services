import { DistrictAttributes } from '@models/district';
import { MomcAttributes } from '@models/momc';
import { MopAttributes } from '@models/mop';
import { RegionAttributes } from '@models/region';

export type AddressType = {
  stringAddress: string;
  region: RegionAttributes['_id'];
  district: DistrictAttributes['_id'];
  mop?: MopAttributes['_id'];
  momc?: MomcAttributes['_id'];
};

export const addressSchema = {
  stringAddress: {
    type: String,
    required: true,
  },

  region: { type: Number, ref: 'Region', required: true },
  district: { type: Number, ref: 'District', required: true },
  mop: { type: Number, ref: 'Mop' },
  momc: { type: Number, ref: 'Momc' },
};
