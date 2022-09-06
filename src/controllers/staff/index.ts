import joiRouter from 'koa-joi-router';

import registerRouter from './register';

const router = joiRouter();

router.prefix('/staff');

router.use(registerRouter.middleware());

export default router;
