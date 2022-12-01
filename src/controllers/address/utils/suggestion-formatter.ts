import { RawSuggestion, SuggestionFormData } from '../types';

export const formatSuggestion = (
  rawSuggestion: RawSuggestion,
): SuggestionFormData | undefined => {
  if (rawSuggestion.category !== 'address_cz') return;

  const {
    userData: {
      street,
      streetNumber,
      houseNumber,
      region,
      district,
      quarter,
      longitude,
      latitude,
    },
  } = rawSuggestion;

  const stringAddress = `${street} ${houseNumber}${
    houseNumber && streetNumber ? '/' : ''
  }${streetNumber}`;
  return {
    stringAddress,

    regionString: region,
    districtString: district,
    quarterString: quarter,

    coordinates: [longitude, latitude],
  };
};
