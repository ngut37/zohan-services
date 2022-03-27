import { RawCompany } from '@models/company';

export type ParsedRawCompany = {
  '?xml': string;
  'are:Ares_odpovedi': {
    'are:Odpoved': {
      'are:Pocet_zaznamu': number;
      'are:Typ_vyhledani': string;
      'are:Zaznam'?: {
        'are:Shoda_ICO': {
          'dtt:Kod': number;
        };
        'are:Vyhledano_dle': string;
        'are:Typ_registru': {
          'dtt:Kod': number;
          'dtt:Text': string;
        };
        'are:Datum_vzniku': string;
        'are:Datum_platnosti': string;
        'are:Pravni_forma': {
          'dtt:Kod_PF': number;
        };
        'are:Obchodni_firma': string;
        'are:ICO': number;
        'are:Identifikace': {
          'are:Adresa_ARES': {
            'dtt:ID_adresy': number;
            'dtt:Kod_statu': number;
            'dtt:Nazev_okresu': string;
            'dtt:Nazev_obce': string;
            'dtt:Nazev_casti_obce': string;
            'dtt:Nazev_mestske_casti': string;
            'dtt:Nazev_ulice': string;
            'dtt:Cislo_domovni': number;
            'dtt:Typ_cislo_domovni': number;
            'dtt:Cislo_orientacni': number;
            'dtt:PSC': number;
            'dtt:Adresa_UIR': {
              'udt:Kod_oblasti': number;
              'udt:Kod_kraje': number;
              'udt:Kod_okresu': number;
              'udt:Kod_obce': number;
              'udt:Kod_pobvod': number; // district of Prague only
              'udt:Kod_nobvod': number;
              'udt:Kod_casti_obce': number;
              'udt:Kod_mestske_casti': number;
              'udt:PSC': number;
              'udt:Kod_ulice': number;
              'udt:Cislo_domovni': number;
              'udt:Typ_cislo_domovni': number;
              'udt:Cislo_orientacni': number;
              'udt:Kod_adresy': number;
              'udt:Kod_objektu': number;
            };
          };
        };
        'are:Kod_FU': number;
        'are:Priznaky_subjektu': string;
      };
    };
  };
};

export const formatFetchedCompany = (
  rawJsonCompany: ParsedRawCompany,
): RawCompany | undefined => {
  if (rawJsonCompany['are:Ares_odpovedi']['are:Odpoved']['are:Zaznam']) {
    const record =
      rawJsonCompany['are:Ares_odpovedi']['are:Odpoved']['are:Zaznam'];

    const ico = record['are:ICO'];

    const name = record['are:Obchodni_firma'];

    //! ADD date created and date valid from

    const { 'dtt:Nazev_ulice': street, 'dtt:Adresa_UIR': ruianIds } =
      record['are:Identifikace']['are:Adresa_ARES'];

    const {
      'udt:Kod_kraje': regionId,
      'udt:Kod_okresu': districtId,
      'udt:Kod_obce': municipalityId,
      'udt:Kod_casti_obce': municipalityPartId,
      'udt:Kod_mestske_casti': momcId,
      'udt:Kod_pobvod': mopId,
      'udt:PSC': zipCode,
      'udt:Kod_ulice': streetId,
      'udt:Cislo_domovni': houseNumber,
      'udt:Typ_cislo_domovni': houseNumberType,
      'udt:Cislo_orientacni': streetNumber,
      'udt:Kod_adresy': addressId,
      'udt:Kod_objektu': buildingId,
    } = ruianIds;

    const stringAddress = `${street} ${houseNumber}${
      streetNumber ? `/${streetNumber}` : ''
    }`;

    return {
      ico: ico.toString(),
      name,

      stringAddress,

      region: regionId,
      district: districtId,
      mop: mopId,
      momc: momcId,
      ruianIds: {
        regionId,
        districtId,
        municipalityId,
        municipalityPartId,
        momcId,
        mopId,
        zipCode,
        streetId,
        houseNumber,
        houseNumberType,
        streetNumber,
        addressId,
        buildingId,
      },
    };
  } else {
    return undefined;
  }
};
