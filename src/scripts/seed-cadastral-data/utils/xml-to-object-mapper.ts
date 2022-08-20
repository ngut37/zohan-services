import { DistrictAttributes } from '@models/district';
import { MomcAttributes } from '@models/momc';
import { MopAttributes } from '@models/mop';
import { RegionAttributes } from '@models/region';
import { Point } from '@models/types';
import { CompleteRuianData, RuianData } from '../types/ruian-data';

import { krovakStringToGps } from './krovat-to-gps';

const PRAGUE_REGION_NAME = 'Prah';
const CAPITAL_WORD_PART = 'Hlavn';
const POINT_TYPE: Point['type'] = 'Point';

export const trimCompleteRuianData = (
  completeData: CompleteRuianData,
): RuianData => {
  const trimmedRuianData: RuianData = {
    'vf:Vusc': completeData['vf:Vusc'],
    'vf:Okresy': completeData['vf:Okresy'],
    'vf:Mop': completeData['vf:Mop'],
    'vf:Momc': completeData['vf:Momc'],
  };

  return trimmedRuianData;
};

// export const transformState = (
//   ruianState: RuianData['vf:Staty']['vf:Stat'],
// ): State => {
//   const krovakString =
//     ruianState['sti:Geometrie']['sti:DefinicniBod']['gml:Point']['gml:pos'];

//   const gpsCoordinates = krovakStringToGps(krovakString);

//   const mappedState: State = {
//     id: ruianState['sti:Kod'],
//     name: ruianState['sti:Nazev'],
//     point: {
//       type: 'Point',
//       coordinates: gpsCoordinates,
//     },
//   };

//   return mappedState;
// };

export const transformRegions = (
  ruianRegions: RuianData['vf:Vusc']['vf:Vusc'],
): RegionAttributes[] => {
  const mappedRegions: RegionAttributes[] = ruianRegions
    .map((ruianRegion) => {
      const krovakString =
        ruianRegion['vci:Geometrie']['vci:DefinicniBod']['gml:Point'][
          'gml:pos'
        ];
      const gpsCoordinates = krovakStringToGps(krovakString);

      if (!gpsCoordinates) {
        return console.log(
          `[transformRegions] Could not generate coordinates for ruianRegion ${JSON.stringify(
            ruianRegion,
          )}`,
        );
      }

      return {
        _id: ruianRegion['vci:Kod'],
        name: ruianRegion['vci:Nazev'],
        point: {
          type: POINT_TYPE,
          coordinates: gpsCoordinates,
        },
      };
    })
    .filter(Boolean) as RegionAttributes[];

  return mappedRegions;
};

export const transformDistricts = (
  ruianDistricts: RuianData['vf:Okresy']['vf:Okres'],
): DistrictAttributes[] => {
  const mappedDistricts: DistrictAttributes[] = ruianDistricts
    .map((ruianDistrict) => {
      const krovakString =
        ruianDistrict['oki:Geometrie']['oki:DefinicniBod']['gml:Point'][
          'gml:pos'
        ];
      const gpsCoordinates = krovakStringToGps(krovakString);

      if (!gpsCoordinates) {
        return console.log(
          `[transformDistricts] Could not generate coordinates for ruianDistrict ${JSON.stringify(
            ruianDistrict,
          )}`,
        );
      }

      return {
        _id: ruianDistrict['oki:Kod'],
        name: ruianDistrict['oki:Nazev'],
        point: {
          type: POINT_TYPE,
          coordinates: krovakStringToGps(krovakString),
        },
        region: ruianDistrict['oki:Vusc']['vci:Kod'],
      };
    })
    .filter(Boolean) as DistrictAttributes[];

  return mappedDistricts;
};

export const transformMops = (
  ruianMops: RuianData['vf:Mop']['vf:Mop'],
  pragueDistrictId: number,
): MopAttributes[] => {
  const mappedMops: MopAttributes[] = ruianMops
    .map((ruianMop) => {
      const krovakString =
        ruianMop['mpi:Geometrie']['mpi:DefinicniBod']['gml:Point']['gml:pos'];
      const gpsCoordinates = krovakStringToGps(krovakString);

      if (!gpsCoordinates) {
        return console.log(
          `[transformMops] Could not generate coordinates for ruianMop ${JSON.stringify(
            ruianMop,
          )}`,
        );
      }

      return {
        _id: ruianMop['mpi:Kod'],
        name: ruianMop['mpi:Nazev'],
        point: {
          type: POINT_TYPE,
          coordinates: gpsCoordinates,
        },
        district: pragueDistrictId,
      };
    })
    .filter(Boolean) as MopAttributes[];

  return mappedMops;
};

export const transformMomcs = (
  ruianMomcs: RuianData['vf:Momc']['vf:Momc'],
): MomcAttributes[] => {
  const mappedMomcs: MomcAttributes[] = ruianMomcs
    .filter((ruianMomc) => ruianMomc['mci:Mop'])
    .map((ruianMomc) => {
      const krovakString =
        ruianMomc['mci:Geometrie']['mci:DefinicniBod']['gml:Point']['gml:pos'];
      const gpsCoordinates = krovakStringToGps(krovakString);

      if (!gpsCoordinates) {
        return console.log(
          `[transformMomcs] Could not generate coordinates for ruianMomc ${JSON.stringify(
            ruianMomc,
          )}`,
        );
      }

      return {
        _id: ruianMomc['mci:Kod'],
        name: ruianMomc['mci:Nazev'],
        point: {
          type: POINT_TYPE,
          coordinates: gpsCoordinates,
        },
        mop: ruianMomc['mci:Mop']?.['mpi:Kod'] || 0,
      };
    })
    .filter(Boolean) as MomcAttributes[];

  return mappedMomcs;
};

export const transformRuianData = (ruianData: RuianData) => {
  const districts = transformDistricts(ruianData['vf:Okresy']['vf:Okres']);

  const pragueDistrict = districts.find((district) => {
    const districtNameLowerCase = district.name.toLocaleLowerCase();
    const includesCapitalWord = districtNameLowerCase.includes(
      CAPITAL_WORD_PART.toLocaleLowerCase(),
    );
    const includesPragueWord = districtNameLowerCase.includes(
      PRAGUE_REGION_NAME.toLocaleLowerCase(),
    );

    return includesCapitalWord && includesPragueWord;
  });

  if (!pragueDistrict)
    throw new Error(
      'Prague district was not found (is needed for MOP generating).',
    );

  const mappedRuianData = {
    regions: transformRegions(ruianData['vf:Vusc']['vf:Vusc']),
    districts,
    mops: transformMops(ruianData['vf:Mop']['vf:Mop'], pragueDistrict?._id),
    momcs: transformMomcs(ruianData['vf:Momc']['vf:Momc']),
  };

  return mappedRuianData;
};
