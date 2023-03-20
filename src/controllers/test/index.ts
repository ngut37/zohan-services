import joiRouter from 'koa-joi-router';

// import addUserRouter from './template';
import veriff from './temp';

const router = joiRouter();

router.prefix('/test');

// router.use(addUserRouter.middleware());
router.use(veriff.middleware());

export default router;
