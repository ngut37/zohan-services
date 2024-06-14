import { RawCompany } from '@models/company';

export interface CompanyData {
  ico: string;
  obchodniJmeno: string;
  sidlo: Address;
  pravniForma: string;
  financniUrad: string;
  datumVzniku: string;
  datumAktualizace: string;
  dic: string;
  icoId: string;
  adresaDorucovaci: DeliveryAddress;
  seznamRegistraci: RegistrationsStatus;
  primarniZdroj: string;
  czNace: string[];
}

interface Address {
  kodStatu: string;
  nazevStatu: string;
  kodKraje: number;
  nazevKraje: string;
  kodOkresu: number;
  kodObce: number;
  nazevObce: string;
  kodMestskehoObvodu: number;
  nazevMestskehoObvodu: string;
  kodMestskeCastiObvodu: number;
  kodUlice: number;
  nazevMestskeCastiObvodu: string;
  nazevUlice: string;
  cisloDomovni: number;
  kodCastiObce: number;
  cisloOrientacni: number;
  nazevCastiObce: string;
  kodAdresnihoMista: number;
  psc: number;
  textovaAdresa: string;
  typCisloDomovni: string;
  standardizaceAdresy: boolean;
}

interface DeliveryAddress {
  radekAdresy1: string;
  radekAdresy2: string;
  radekAdresy3: string;
}

interface RegistrationsStatus {
  stavZdrojeVr: string;
  stavZdrojeRes: string;
  stavZdrojeRzp: string;
  stavZdrojeNrpzs: string;
  stavZdrojeRpsh: string;
  stavZdrojeRcns: string;
  stavZdrojeSzr: string;
  stavZdrojeDph: string;
  stavZdrojeSd: string;
  stavZdrojeIr: string;
  stavZdrojeCeu: string;
  stavZdrojeRs: string;
  stavZdrojeRed: string;
}

export const formatFetchedCompany = (
  companyData: CompanyData,
): RawCompany | undefined => {
  if (companyData.ico) {
    const ico = companyData.ico;
    const name = companyData.obchodniJmeno;
    const legalForm = companyData.pravniForma;

    const {
      kodKraje: regionId,
      kodOkresu: districtId,
      kodObce: _municipalityId,
      kodCastiObce: _municipalityPartId,
      kodMestskeCastiObvodu: momcId,
      kodMestskehoObvodu: mopId,
      kodUlice: _streetId,
      psc: _zipCode,
      cisloDomovni: houseNumber,
      typCisloDomovni: _houseNumberType,
      cisloOrientacni: streetNumber,
      kodAdresnihoMista: _addressId,
      nazevUlice: street,
      nazevCastiObce: municipalityPart,
    } = companyData.sidlo;

    const stringAddress = `${street || municipalityPart} ${houseNumber}${
      streetNumber ? `/${streetNumber}` : ''
    }`;

    return {
      ico: ico.toString(),
      name,
      legalForm: parseInt(legalForm, 10),

      stringAddress,

      region: regionId,
      district: districtId,
      mop: mopId,
      momc: momcId,
    };
  } else {
    return undefined;
  }
};
