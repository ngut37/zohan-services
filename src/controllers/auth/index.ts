import joiRouter from 'koa-joi-router';

import loginRouter from './login';
import logoutRouter from './logout';
import registerRouter from './register';
import updateRouter from './update';
import getRouter from './get';
import meRouter from './me';
import refreshTokenRouter from './refresh-token';
import userExistsByEmailRouter from './user-exists-by-email';
import oAuthLoginRouter from './o-auth-login';

const router = joiRouter();

router.prefix('/auth');

router.use(loginRouter.middleware());
router.use(logoutRouter.middleware());
router.use(registerRouter.middleware());
router.use(updateRouter.middleware());
router.use(getRouter.middleware());
router.use(meRouter.middleware());
router.use(refreshTokenRouter.middleware());
router.use(userExistsByEmailRouter.middleware());
router.use(oAuthLoginRouter.middleware());

export default router;
