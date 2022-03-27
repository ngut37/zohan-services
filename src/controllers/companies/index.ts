import joiRouter from 'koa-joi-router';

import fetchByIcoRouter from './fetch-by-ico';
import registerRouter from './register';

const router = joiRouter();

router.prefix('/companies');

router.use(fetchByIcoRouter.middleware());
router.use(registerRouter.middleware());

export default router;
