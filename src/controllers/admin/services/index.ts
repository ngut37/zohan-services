import joiRouter from 'koa-joi-router';

import upsertManyRouter from './upsert-many';
import createRouter from './create';
// import editRouter from './edit';

const router = joiRouter();

router.prefix('/services');

router.use(upsertManyRouter.middleware());
router.use(createRouter.middleware());
// router.use(editRouter.middleware());

export default router;
