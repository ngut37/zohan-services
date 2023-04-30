import joiRouter from 'koa-joi-router';

import createRouter from './create';
import editRouter from './edit';
import deleteRouter from './delete';
import getAllRouter from './get-all';
import getRouter from './get';
import getServicesRouter from './get-services';
import getStaffRouter from './get-staff';

const router = joiRouter();

router.prefix('/venues');

router.use(createRouter.middleware());
router.use(editRouter.middleware());
router.use(deleteRouter.middleware());
router.use(getAllRouter.middleware());
router.use(getRouter.middleware());
router.use(getServicesRouter.middleware());
router.use(getStaffRouter.middleware());

export default router;
