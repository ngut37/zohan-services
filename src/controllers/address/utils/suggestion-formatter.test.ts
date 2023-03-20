import { RawSuggestion } from '../types';
import { formatSuggestion } from './suggestion-formatter';

describe('suggestion-formatter', () => {
  const rawSuggestion: RawSuggestion = {
    category: 'address_cz',
    highlight: [],
    sentence: '',
    userData: {
      bbox: [
        50.007521384835044, 14.426037757603071, 50.009686344551646,
        14.43165222812882,
      ],
      correctedResult: false,
      country: 'Česko',
      district: 'Hlavní město Praha',
      enabled: true,
      evidenceNumber: '',
      hasAddress: false,
      highlight: [0, 11],
      highlightSecond: [],
      houseNumber: '3182',
      iconType: 'geo',
      id: 8957716,
      img: '',
      importance: 0.08914,
      latitude: 50.00860387688342,
      longitude: 14.42884499286595,
      mmid: '',
      mmsource: '',
      mmtype: '',
      muniId: '3468',
      municipality: 'Praha',
      nuts: 'CZ0100',
      poiType: 'poi220',
      poiTypeId: 220,
      popularity: 0.27400100231170654,
      premiseIds: [],
      quarter: 'Praha 12',
      region: 'Hlavní město Praha',
      relevance: 0.2104375,
      ruianId: 21938393,
      source: 'addr',
      street: 'Rilská',
      streetNumber: '4',
      suggestFirstRow: 'Rilská 3182/4',
      suggestSecondRow: 'Adresa, Praha 12 - Modřany, Česko',
      suggestThirdRow: '',
      ward: 'Modřany',
      wikiId: '',
      zipCode: '14300',
    },
  };

  it('should format RawSuggestion to SuggestionFormData', () => {
    const formatterResult = formatSuggestion(rawSuggestion);

    expect(formatterResult).toMatchObject({
      coordinates: [14.42884499286595, 50.00860387688342],
      districtString: 'Hlavní město Praha',
      quarterString: 'Praha 12',
      regionString: 'Hlavní město Praha',
      stringAddress: 'Rilská 3182/4',
    });
  });
});
