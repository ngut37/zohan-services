import { Context } from 'koa';

import { Region } from '@models/region';
import { District } from '@models/district';
import { Momc } from '@models/momc';
import { AddressType } from '@models/shared/location';

export const mapLocationToIds = async ({
  regionString,
  districtString,
  quarterString,

  ctx,
}: {
  regionString: string;
  districtString: string;
  quarterString?: string; // momc

  ctx: Context;
}): Promise<Omit<AddressType, 'stringAddress'>> => {
  const region = await Region.findOne({
    name: { $regex: new RegExp(regionString, 'i') },
  });

  if (!region) {
    return ctx.throw(404, `Region with name "${regionString} was not found.`);
  }

  const district = await District.findOne({
    name: { $regex: new RegExp(districtString, 'i') },
  });

  if (!district) {
    return ctx.throw(
      404,
      `District with name "${districtString} was not found.`,
    );
  }

  let momc: Momc | undefined;
  let mopId: Momc['mop'] | undefined = undefined;
  if (quarterString) {
    momc =
      (await Momc.findOne({
        name: { $regex: new RegExp(quarterString, 'i') },
      })) ?? undefined;

    // MOMC is found if MOMC is located in Prague
    if (momc) {
      mopId = momc.mop;
    }
  }

  return {
    region: region.id,
    district: district.id,
    mop: mopId,
    momc: momc?.id,
  };
};
