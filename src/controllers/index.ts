import Router from 'koa-router';

import authRouter from './auth';
import reservationsRouter from './reservations';
import testRouter from './test';

const router = new Router();

router.use(authRouter.middleware());
router.use(reservationsRouter.middleware());
router.use(testRouter.middleware());

export default router;