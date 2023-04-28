import joiRouter from 'koa-joi-router';

import createRouter from './create';
import getManyRouter from './get-many';
import editRouter from './edit';
import deleteRouter from './delete';

const router = joiRouter();

router.prefix('/bookings');

router.use(createRouter.middleware());
router.use(getManyRouter.middleware());
router.use(editRouter.middleware());
router.use(deleteRouter.middleware());

export default router;
