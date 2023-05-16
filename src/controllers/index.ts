import Router from 'koa-router';

import adminRouter from './admin';

import addressRouter from './address';
import authRouter from './auth';
import testRouter from './test';

const router = new Router();

// router for admin
router.use(adminRouter.middleware());

// public routes (protected and unprotected)
router.use(addressRouter.middleware());
router.use(authRouter.middleware());
router.use(testRouter.middleware());

export default router;
