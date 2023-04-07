import joiRouter from 'koa-joi-router';

import createRouter from './create';
import editRouter from './edit';
import getAllRouter from './get-all';
import getRouter from './get';

const router = joiRouter();

router.prefix('/venues');

router.use(createRouter.middleware());
router.use(editRouter.middleware());
router.use(getAllRouter.middleware());
router.use(getRouter.middleware());

export default router;
