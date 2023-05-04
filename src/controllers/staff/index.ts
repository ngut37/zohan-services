import joiRouter from 'koa-joi-router';

import loginRouter from './login';
import logoutRouter from './logout';
import refreshTokenRouter from './refresh-token';

import getAllRouter from './get-all';
import editRouter from './edit';
import createRouter from './create';
import deleteRouter from './delete';
import getBookingsRouter from './get-bookings';

const router = joiRouter();

router.prefix('/staff');

// auth endpoints
router.use(loginRouter.middleware());
router.use(logoutRouter.middleware());
router.use(refreshTokenRouter.middleware());

// CRUD endpoint
router.use(getAllRouter.middleware());
router.use(createRouter.middleware());
router.use(editRouter.middleware());
router.use(deleteRouter.middleware());
router.use(getBookingsRouter.middleware());

export default router;
