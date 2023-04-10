import joiRouter from 'koa-joi-router';

import { ServiceName, ServiceType } from '@models/service';

const router = joiRouter();

router.route({
  path: '/variants',
  method: 'get',
  handler: [
    async (ctx) => {
      const types: Record<ServiceType, ServiceName[]> = {
        hair: ['hair_cut', 'hair_color'],
        nail: ['nail_acrylic', 'nail_gel'],
        tattoo: [
          'tattoo_small_black',
          'tattoo_medium_black',
          'tattoo_small_color',
          'tattoo_medium_color',
        ],
        massage: ['massage_thai', 'massage_turkish'],
        spa: ['spa_wellness_jacuzzi', 'spa_sauna'],
      };

      ctx.body = {
        success: true,
        data: { ...types },
      };
    },
  ],
});

export default router;
