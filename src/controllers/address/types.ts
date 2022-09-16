export type RawSuggestion = {
  category: string;
  highlight: any[];
  sentence: string;
  userData: UserData;
};

export type UserData = {
  bbox: number[];
  correctedResult: boolean;
  country: string;
  district: string;
  enabled: boolean;
  evidenceNumber: string;
  hasAddress: boolean;
  highlight: number[];
  highlightSecond: any[];
  houseNumber: string;
  iconType: string;
  id: number;
  img: string;
  importance: number;
  latitude: number;
  longitude: number;
  mmid: string;
  mmsource: string;
  mmtype: string;
  muniId: string;
  municipality: string;
  nuts: string;
  poiType: string;
  poiTypeId: number;
  popularity: number;
  premiseIds: any[];
  quarter: string;
  region: string;
  relevance: number;
  ruianId: number;
  source: string;
  street: string;
  streetNumber: string;
  suggestFirstRow: string;
  suggestSecondRow: string;
  suggestThirdRow: string;
  ward: string;
  wikiId: string;
  zipCode: string;
};

export type SuggestionFormData = {
  stringAddress: string;

  regionString: string;
  districtString: string;
  /** momc */
  quarterString?: string;
};
