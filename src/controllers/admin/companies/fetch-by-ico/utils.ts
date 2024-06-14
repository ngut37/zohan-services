import { Company } from '@models/company';
import { District } from '@models/district';
import { Momc } from '@models/momc';
import { Region } from '@models/region';
import { CompanyFormData } from '../types';

export const mapCompanyToFormData = async (
  company: Company,
): Promise<CompanyFormData> => {
  // populate region, district and momc
  const populatedCompany = await company.populate<{
    region: Region;
    district: District;
    momc: Momc;
  }>(['region', 'district', 'momc']);

  const {
    ico,
    name,
    legalForm,
    stringAddress,
    region: { name: regionString },
    district: { name: districtString },
    momc,
    complete,
  } = populatedCompany;

  return {
    ico,
    name,
    legalForm,
    stringAddress,
    regionString,
    districtString,
    quarterString: momc?.name,
    complete,
  };
};
