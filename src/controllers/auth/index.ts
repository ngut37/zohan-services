import joiRouter from 'koa-joi-router';

import loginRouter from './login';
import logoutRouter from './logout';
import registerRouter from './register';
import getRouter from './get';
import meRouter from './me';

const router = joiRouter();

router.prefix('/auth');

router.use(loginRouter.middleware());
router.use(logoutRouter.middleware());
router.use(registerRouter.middleware());
router.use(getRouter.middleware());
router.use(meRouter.middleware());

export default router;
