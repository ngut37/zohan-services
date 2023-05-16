import joiRouter from 'koa-joi-router';

import listRouter from './list';

const router = joiRouter();

router.prefix('/venues');

router.use(listRouter.middleware());

export default router;
