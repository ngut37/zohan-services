import { PipelineStage } from 'mongoose';
import joiRouter from 'koa-joi-router';

import { District } from '@models/district';
import { Mop } from '@models/mop';
import { Region } from '@models/region';

const router = joiRouter();

router.route({
  path: '/regions',
  method: 'get',
  handler: async (ctx) => {
    // get all regions its districts and districts' mops
    const pipelineStages: PipelineStage[] = [
      {
        $lookup: {
          from: 'districts',
          localField: '_id',
          foreignField: 'region',
          as: 'districts',
        },
      },
      {
        $unwind: {
          path: '$districts',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'mops',
          localField: 'districts._id',
          foreignField: 'district',
          as: 'districts.mops',
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          point: { $first: '$point' },
          districts: { $push: '$districts' },
        },
      },
      {
        $project: {
          _id: 1,
          name: '$name',
          districts: {
            _id: 1,
            name: 1,
            mops: {
              _id: 1,
              name: 1,
            },
          },
        },
      },
    ];

    const aggregationResult = (await Region.aggregate<any>(
      pipelineStages,
    ).exec()) as (Region & {
      districts?: (District & {
        mop: Mop[];
      })[];
    })[];

    // sort by region ID
    const sortedAggregationResult = aggregationResult.sort((a, b) => {
      if (a._id < b._id) {
        return -1;
      }

      if (a._id > b._id) {
        return 1;
      }

      return 0;
    });

    ctx.body = {
      success: true,
      data: sortedAggregationResult,
    };
  },
});

export default router;
