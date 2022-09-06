export type AddressInfo = {
  point?: [number, number];
  ruianIds: RuianIds;
  district: string;
  municipality: string;
  municipalityPart: string;
  momc: string;
  street: string;
  houseNumber: string;
  streetNumber?: string;
};

export type RuianIds = {
  regionId?: number;
  districtId?: number;
  municipalityId?: number;
  municipalityPartId?: number;
  momcId?: number; // district of a city
  mopId?: number; // district of Prague
  zipCode?: number;
  streetId?: number;
  houseNumber?: number;
  houseNumberType?: number;
  streetNumber?: number;
  addressId?: number;
  buildingId?: number;
};

export const addressSchema = {
  point: [Number],
  ruianIds: {
    regionId: Number,
    districtId: Number,
    municipalityId: Number,
    municipalityPartId: Number,
    momcId: Number, // district of a city
    mopId: Number, // district of Prague
    zipCode: Number,
    streetId: Number,
    houseNumber: Number,
    houseNumberType: Number,
    streetNumber: Number,
    addressId: Number,
    buildingId: Number,
  },
  district: String,
  municipality: String,
  municipalityPart: String,
  momc: String,
  street: String,
  houseNumber: String,
  streetNumber: String,
};
