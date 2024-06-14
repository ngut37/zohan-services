import { Coordinates } from '@models/types';

export type CompanyFormData = {
  ico: string;
  name: string;
  // TODO: change to true once Admin app is ready
  legalForm?: number;

  // address: AddressInfo;
  stringAddress: string;

  regionString: string;
  districtString: string;
  /** momc */
  quarterString?: string;
  coordinates?: Coordinates;

  complete?: boolean;
};
