import joiRouter from 'koa-joi-router';

import addUserRouter from './template';

const router = joiRouter();

router.prefix('/test');

router.use(addUserRouter.middleware());

export default router;
