import joiRouter from 'koa-joi-router';

import registerRouter from './register';
import loginRouter from './login';
import logoutRouter from './logout';
import refreshTokenRouter from './refresh-token';

const router = joiRouter();

router.prefix('/staff');

router.use(registerRouter.middleware());
router.use(loginRouter.middleware());
router.use(logoutRouter.middleware());
router.use(refreshTokenRouter.middleware());

export default router;
