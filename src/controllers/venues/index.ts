import joiRouter from 'koa-joi-router';

import listRouter from './list';
import getRouter from './get-by-id';

const router = joiRouter();

router.prefix('/venues');

router.use(listRouter.middleware());
router.use(getRouter.middleware());

export default router;
