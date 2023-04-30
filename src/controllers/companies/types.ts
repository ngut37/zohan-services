import { Coordinates } from '@models/types';

export type CompanyFormData = {
  ico: string;
  name: string;
  // address: AddressInfo;
  stringAddress: string;

  regionString: string;
  districtString: string;
  /** momc */
  quarterString?: string;
  coordinates?: Coordinates;

  complete?: boolean;
};
