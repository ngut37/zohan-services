import joiRouter from 'koa-joi-router';

import fetchByIcoRouter from './fetch-by-ico/fetch-by-ico';
import createRouter from './create';

const router = joiRouter();

router.prefix('/companies');

router.use(fetchByIcoRouter.middleware());
router.use(createRouter.middleware());

export default router;
