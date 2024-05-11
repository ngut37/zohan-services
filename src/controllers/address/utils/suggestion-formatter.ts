import { RawSuggestion, SuggestionFormData } from '../types';

export const formatSuggestion = (
  rawSuggestion: RawSuggestion,
): SuggestionFormData | undefined => {
  if (rawSuggestion.category !== 'address_cz') return;

  const {
    userData: {
      municipality,
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

  const stringAddress = `${street || municipality} ${houseNumber}${
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
