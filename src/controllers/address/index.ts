import joiRouter from 'koa-joi-router';

import suggestRouter from './suggest';
import regionsRouter from './regions';

const router = joiRouter();

router.prefix('/address');

router.use(suggestRouter.middleware());
router.use(regionsRouter.middleware());

export default router;
