import joiRouter from 'koa-joi-router';

import createRouter from './create';
import getAllRouter from './get-all';
import editRouter from './edit';

const router = joiRouter();

router.prefix('/venues');

router.use(createRouter.middleware());
router.use(getAllRouter.middleware());
router.use(editRouter.middleware());

export default router;
