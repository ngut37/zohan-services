import joiRouter from 'koa-joi-router';

import suggestRouter from './suggest';

const router = joiRouter();

router.prefix('/address');

router.use(suggestRouter.middleware());

export default router;
